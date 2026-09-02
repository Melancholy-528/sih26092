from sqlalchemy import Boolean, Float, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    provider: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    beneficiary_category: Mapped[str] = mapped_column(String(100), default="SC")
    min_project_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_project_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_loan_amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    beneficiary_interest_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    repayment_years: Mapped[int | None] = mapped_column(Integer, nullable=True)
    moratorium_months: Mapped[int | None] = mapped_column(Integer, nullable=True)
    channel_partners: Mapped[list] = mapped_column(JSON, default=list)
    purposes: Mapped[list] = mapped_column(JSON, default=list)
    required_documents: Mapped[list] = mapped_column(JSON, default=list)
    eligibility_rules: Mapped[list] = mapped_column(JSON, default=list)
    source_url: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
