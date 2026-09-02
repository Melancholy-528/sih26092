from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "SIH26092 Scheme Matching API"
    database_url: str = "sqlite:///./sih26092.db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    llm_provider: str = "ollama"
    llm_timeout: float = 60.0
    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "qwen2.5-coder:3b"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    openai_api_key: str = ""
    openai_model: str = "gpt-5-mini"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    @property
    def cors_list(self): return [x.strip() for x in self.cors_origins.split(",") if x.strip()]
settings = Settings()
