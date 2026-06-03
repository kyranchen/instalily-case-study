# PartSelect Assistant — Frontend

Chat interface for the PartSelect refrigerator/dishwasher parts agent, styled to
PartSelect's teal-and-white branding. Built on the provided Create React App
starter and wired to the [FastAPI backend](../instalily-backend).

The chat is **read-only customer support** over catalog knowledge: look up a
part, check whether one fits a model, find a part by symptom, or get repair
guidance. When the agent references specific parts, they render as clickable
product cards (image, part number, price) beneath the message.

---

## Prerequisites

The [backend](../instalily-backend) must be running on `http://localhost:8000`
first — see its README. The chat shows a friendly "I can't reach the assistant"
message if the backend is down.

## Run

```bash
cd instalily-case-study
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

> If `npm install` fails with an `EACCES` / cache permission error, the npm
> cache has root-owned files. Use an isolated cache for one run:
> `npm install --cache /tmp/npm-cache`. Subsequent `npm start` runs are
> unaffected.

To point at a non-default backend URL:

```bash
REACT_APP_BACKEND_URL=http://localhost:9000 npm start
```

---

## What was changed from the starter

| File | Change |
|------|--------|
| `src/api/api.js` | Replaced the stub with a real `POST /chat` call; generates and persists a `session_id` (UUID) in `sessionStorage`; handles network/server errors gracefully |
| `src/components/ChatWindow.js` | Renders product cards under assistant messages; typing indicator while awaiting a reply; input disabled mid-request |
| `src/components/ProductCard.js` / `.css` | New — product card (image, name, part #, price) linking to the PartSelect page |
| `src/components/ChatWindow.css` | PartSelect teal palette, height-bounded scroll area, markdown styling, focus states |
| `src/App.css` / `src/App.js` | Teal header, renamed to "PartSelect Assistant" |

## How it talks to the backend

`getAIMessage(text)` POSTs `{ message, session_id }` to `/chat`. The
`session_id` is created once per browser tab and kept in `sessionStorage`, which
mirrors the backend's in-memory, per-session model — so multi-turn context
("is *this part* compatible with my model?") resolves correctly within a tab and
resets when the tab closes.

The response shape is:

```json
{
  "response": "markdown text",
  "parts": [
    { "part_number": "PS11752778", "name": "...", "price": "$47.40",
      "image_url": "...", "source_url": "..." }
  ],
  "tool_calls": [ ... ]
}
```

`response` is rendered as markdown; each entry in `parts` becomes a product
card. `tool_calls` is available for debugging but not displayed.

## Feature choices

Scoped deliberately to **support over a read-only catalog** rather than
mock order/cart mutations:

- **Part lookup** by PS number or manufacturer part number
- **Compatibility checks** against a specific appliance model
- **Symptom-based search** ("my ice maker is noisy") returning ranked candidates
- **Repair guidance** grounded in catalog content
- **Product cards** so users see and click through to the actual part
- **Conversational memory** so follow-ups can say "this part" / "my model"

Cart and order flows were intentionally left out: the provided starter has no
cart, and the agent's value here is accurate parts knowledge, not transaction
plumbing.
