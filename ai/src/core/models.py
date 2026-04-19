from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, JSON, Column

class AIInteraction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    provider: str = Field(index=True)
    model_name: str
    prompt: str
    response: str
    tokens_used: int = Field(default=0)
    additional_info: dict = Field(default_factory=dict, sa_column=Column(JSON))
    trace_id: Optional[str] = Field(default=None, index=True)
