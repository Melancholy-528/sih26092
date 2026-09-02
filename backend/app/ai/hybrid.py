from app.ai.retriever import search

def build_applicant_text(applicant) -> str:
    return (
        f"Applicant category: {applicant.category}. "
        f"Annual family income: {applicant.annual_family_income}. "
        f"State: {applicant.state}. District: {applicant.district}. "
        f"Project cost: {applicant.project_cost}. "
        f"Business type: {applicant.business_type}. "
        f"Business description: {applicant.business_description}."
    )

def semantic_scheme_scores(applicant, schemes):
    query = build_applicant_text(applicant)
    hits = search(query, top_k=max(10, len(schemes)))
    by_code = {}
    for hit in hits:
        code = hit.get("scheme_code")
        if code:
            by_code[code] = hit["similarity"]

    return by_code
