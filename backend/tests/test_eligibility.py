from types import SimpleNamespace
from app.services.eligibility import evaluate_scheme
from app.schemas.matching import ApplicantInput

def nsfdc_scheme():
    return SimpleNamespace(
        code="NSFDC-TL",
        name="NSFDC Term Loan",
        beneficiary_category="SC",
        min_project_cost=140000,
        max_project_cost=5000000,
        max_loan_amount=4500000,
        beneficiary_interest_rate=8,
        repayment_years=7,
        moratorium_months=6,
        channel_partners=["SCAs"],
        purposes=["transport", "small business"],
        required_documents=["Caste Certificate"],
        source_url="https://nsfdc.nic.in/faqs",
    )

def standup_india_scheme():
    return SimpleNamespace(
        code="STANDUP-INDIA",
        name="Stand-Up India Scheme",
        beneficiary_category="General",
        min_project_cost=1000000,
        max_project_cost=10000000,
        max_loan_amount=10000000,
        beneficiary_interest_rate=9.25,
        repayment_years=7,
        moratorium_months=18,
        channel_partners=["Commercial Banks"],
        purposes=["manufacturing", "services", "trading"],
        required_documents=["Caste Certificate", "DPR"],
        source_url="https://www.standupmitra.in",
    )

def test_eligible_term_loan():
    applicant = ApplicantInput(
        name="Test",
        age=30,
        category="SC",
        gender="male",
        annual_family_income=300000,
        state="Haryana",
        district="Yamuna Nagar",
        project_cost=500000,
        business_type="transport",
    )
    result = evaluate_scheme(applicant, nsfdc_scheme())
    assert result["eligible"] is True
    assert result["score"] > 0

def test_income_failure():
    applicant = ApplicantInput(
        name="Test",
        age=30,
        category="SC",
        gender="male",
        annual_family_income=600000,
        state="Haryana",
        district="Yamuna Nagar",
        project_cost=500000,
        business_type="transport",
    )
    result = evaluate_scheme(applicant, nsfdc_scheme())
    assert result["eligible"] is False
    assert any("income" in x.lower() for x in result["failed_rules"])

def test_standup_india_woman_applicant():
    applicant = ApplicantInput(
        name="Sunita Sharma",
        age=35,
        category="General",
        gender="female",
        annual_family_income=800000,
        state="Maharashtra",
        district="Pune",
        project_cost=2500000,
        business_type="manufacturing",
    )
    result = evaluate_scheme(applicant, standup_india_scheme())
    assert result["eligible"] is True
    assert result["score"] >= 70.0
