# Social Messaging UI

Vanilla JavaScript messaging app with searchable contacts, threaded chat, local persistence, and simulated replies.

## Features

- Contact search and unread badges
- Send messages with timestamps
- Draft persistence per conversation (`localStorage`)
- Auto-replies for demo conversations
- Reset to seed data
- Schema + source tests

## Quick start

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```

## Tech

- HTML / CSS / JavaScript (ES modules)
- JSON seed data + browser storage

## License

MIT
