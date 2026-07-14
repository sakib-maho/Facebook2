import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ChatSchemaTests(unittest.TestCase):
    def test_chats_schema(self):
        data = json.loads((ROOT / "data" / "chats.json").read_text())
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 3)
        for chat in data:
            self.assertIn("id", chat)
            self.assertIn("name", chat)
            self.assertIn("messages", chat)
            self.assertIsInstance(chat["messages"], list)
            self.assertGreaterEqual(len(chat["messages"]), 1)
            for message in chat["messages"]:
                if isinstance(message, dict):
                    self.assertIn("text", message)
                    self.assertIn("from", message)
                    self.assertIn(message["from"], {"me", "them"})

    def test_app_js_exposes_helpers(self):
        source = (ROOT / "assets" / "app.js").read_text()
        for token in ["localStorage", "sendMessage", "autoReply", "normalizeChats", "persist"]:
            self.assertIn(token, source)


if __name__ == "__main__":
    unittest.main()
