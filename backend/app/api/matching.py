from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.scheme import Scheme
from app.schemas.matching import ApplicantInput, MatchResponse, SchemeMatch
from app.services.eligibility import evaluate_scheme
from app.ai.hybrid import semantic_scheme_scores

router = APIRouter(prefix="/api/match", tags=["matching"])

@router.post("", response_model=MatchResponse)
def match_schemes(applicant: ApplicantInput, db: Session = Depends(get_db)):
    schemes = db.scalars(select(Scheme).where(Scheme.active == True)).all()

    try:
        semantic = semantic_scheme_scores(applicant, schemes)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    results = []
    for scheme in schemes:
        rule_result = evaluate_scheme(applicant, scheme)
        semantic_score = semantic.get(scheme.code, 0.0)

        # Hard eligibility remains authoritative.
        # Semantic relevance only affects ranking among eligible schemes.
        if rule_result["eligible"]:
            combined = round(
                (rule_result["score"] * 0.70) + (semantic_score * 100 * 0.30),
                1,
            )
        else:
            combined = round(rule_result["score"], 1)

        results.append(SchemeMatch(
            scheme_id=scheme.id,
            code=scheme.code,
            name=scheme.name,
            eligible=rule_result["eligible"],
            score=combined,
            reasons=rule_result["reasons"] + [
                f"Semantic relevance: {semantic_score:.2%}"
            ],
            failed_rules=rule_result["failed_rules"],
            details={
                **rule_result["details"],
                "semantic_score": round(semantic_score, 4),
                "ranking_method": "70% rule-fit + 30% semantic relevance for eligible schemes",
            },
        ))

    results.sort(key=lambda x: (x.eligible, x.score), reverse=True)
    return MatchResponse(applicant=applicant, matches=results)
