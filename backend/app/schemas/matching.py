from pydantic import BaseModel, Field

class ApplicantInput(BaseModel):
    name: str = Field(default="Applicant", min_length=1, max_length=150)
    age: int = Field(default=30, ge=18, le=100)
    category: str = Field(default="SC", description="SC, ST, OBC, Minority, General")
    gender: str = Field(default="female", description="male, female, other")
    annual_family_income: float = Field(default=250000.0, ge=0)
    state: str = Field(default="Maharashtra")
    district: str = Field(default="Mumbai Suburbs")
    project_cost: float = Field(default=300000.0, gt=0)
    business_type: str = Field(default="transport", description="transport, retail, agriculture, manufacturing, handicrafts, dairy, services, green business")
    business_description: str = Field(default="Starting a small commercial vehicle transport business", max_length=500)

class RuleResult(BaseModel):
    rule: str
    passed: bool
    reason: str

class SchemeMatch(BaseModel):
    scheme_id: int
    code: str
    name: str
    eligible: bool
    score: float
    reasons: list[str]
    failed_rules: list[str]
    details: dict

class MatchResponse(BaseModel):
    applicant: ApplicantInput
    matches: list[SchemeMatch]
