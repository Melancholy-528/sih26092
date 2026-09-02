from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base

class Applicant(Base):
    __tablename__ = "applicants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    age: Mapped[int] = mapped_column(Integer)
    category: Mapped[str] = mapped_column(String(100))
    annual_family_income: Mapped[float] = mapped_column(Float)
    state: Mapped[str] = mapped_column(String(100))
    district: Mapped[str] = mapped_column(String(100))
    project_cost: Mapped[float] = mapped_column(Float)
    business_type: Mapped[str] = mapped_column(String(150))
    business_description: Mapped[str] = mapped_column(String(500), default="")
