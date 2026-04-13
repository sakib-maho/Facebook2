# Social Messaging UI (Facebook2 Upgraded)

This repository now contains a social messaging interface clone built with vanilla web technologies.
It includes searchable contacts, chat rendering, and data schema tests.

## Features

- Search contacts by name
- Select a contact to load chat messages
- JSON-driven chat dataset
- Responsive two-panel layout
- Schema test for chat data
- Legacy archive preserved in `legacy/archives/`

## Run Locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Run Tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```

## License

MIT License. See `LICENSE`.
