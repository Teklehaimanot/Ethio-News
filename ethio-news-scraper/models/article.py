from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Article:
    title: str
    description: str
    image: str
    source: str
    source_url: str
    content: Optional[str] = None
    external_id: Optional[str] = None
    published_at: Optional[datetime] = None
    imported_via: Optional[str] = None
    content_hash: Optional[str] = None

    def __post_init__(self):
        if self.title:
            self.title = self.title.strip()
        if self.description:
            self.description = self.description.strip()
        if self.content:
            self.content = self.content.strip()
