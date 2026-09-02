from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.scheme import Scheme
from pydantic import BaseModel

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

class NewSchemeInput(BaseModel):
    code: str
    name: str
    provider: str
    description: str
    beneficiary_category: str
    min_project_cost: Optional[float] = None
    max_project_cost: Optional[float] = None
    max_loan_amount: Optional[float] = None
    beneficiary_interest_rate: Optional[float] = None
    repayment_years: Optional[int] = None
    moratorium_months: Optional[int] = None
    channel_partners: list[str] = []
    purposes: list[str] = []
    required_documents: list[str] = []
    eligibility_rules: list[str] = []
    source_url: str

@router.get("")
def list_schemes(
    category: Optional[str] = None,
    sector: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = select(Scheme).where(Scheme.active == True)
    schemes = db.scalars(query).all()

    if category:
        c = category.strip().lower()
        schemes = [s for s in schemes if s.beneficiary_category.lower() == c or s.beneficiary_category.lower() == "general"]
    
    if sector:
        sec = sector.strip().lower()
        schemes = [s for s in schemes if any(sec in p.lower() for p in (s.purposes or []))]

    if search:
        kw = search.strip().lower()
        schemes = [
            s for s in schemes
            if kw in s.name.lower() or kw in s.code.lower() or kw in s.description.lower() or kw in s.provider.lower()
        ]

    return schemes

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    schemes = db.scalars(select(Scheme).where(Scheme.active == True)).all()
    
    cat_counts = {}
    total_funding_capacity = 0.0
    for s in schemes:
        cat = s.beneficiary_category
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        total_funding_capacity += (s.max_loan_amount or 0.0)

    avg_interest = round(
        sum(s.beneficiary_interest_rate for s in schemes if s.beneficiary_interest_rate is not None) /
        max(1, len([s for s in schemes if s.beneficiary_interest_rate is not None])),
        2
    )

    return {
        "total_schemes": len(schemes),
        "community_breakdown": cat_counts,
        "total_max_loan_pool": total_funding_capacity,
        "average_interest_rate": avg_interest,
        "providers_count": len(set(s.provider for s in schemes)),
    }

@router.get("/{scheme_id}")
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.get(Scheme, scheme_id)
    if not scheme or not scheme.active:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

@router.post("")
def create_scheme(new_scheme: NewSchemeInput, db: Session = Depends(get_db)):
    existing = db.scalars(select(Scheme).where(Scheme.code == new_scheme.code)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Scheme code already exists.")
    
    scheme = Scheme(**new_scheme.model_dump(), active=True)
    db.add(scheme)
    db.commit()
    db.refresh(scheme)

    # Trigger vector index rebuild in background
    try:
        from app.ai.retriever import build_index
        build_index()
    except Exception:
        pass

    return scheme
