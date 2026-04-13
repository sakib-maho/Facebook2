# Social Messaging UI (Facebook2 Upgraded)

<!-- BrandCloud:readme-standard -->
[![Maintained](https://img.shields.io/badge/Maintained-yes-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Showcase](https://img.shields.io/badge/Portfolio-Showcase-blue.svg)](#)

_Part of the `sakib-maho` project showcase series with consistent documentation and quality standards._

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
