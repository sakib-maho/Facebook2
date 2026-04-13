import json
from pathlib import Path
import unittest


class ChatSchemaTests(unittest.TestCase):
    def test_chat_schema(self) -> None:
        rows = json.loads(Path("data/chats.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(rows), 3)
        for row in rows:
            self.assertIn("id", row)
            self.assertIn("name", row)
            self.assertIn("messages", row)
            self.assertIsInstance(row["messages"], list)
            self.assertTrue(row["name"].strip())


if __name__ == "__main__":
    unittest.main()
