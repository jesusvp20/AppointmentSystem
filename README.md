# Technical Exam Solution — Appointments + Notifier Agent

**Stack:** Node.js + Express + MongoDB · React (Vite) · n8n

| Part | Folder | URL |
|---|---|---|
| Backend API | `backend/` | http://localhost:3000 |
| Swagger Docs | `backend/` | http://localhost:3000/api-docs |
| Frontend UI | `frontend/` | http://localhost:5173 |
| n8n Agent | `AppointmentSystem.json` | http://localhost:5678 |

---

## Quick Start

```powershell
# 1. MongoDB (Docker)
docker run -d --name mongo-appointments -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 `
  -v mongo_data:/data/db mongo:7

# 2. Backend — create backend/.env first (see below), then:
cd backend && npm install && npm run dev

# 3. Frontend
cd frontend && npm install && npm run dev

# 4. n8n Agent
npx n8n
# Open http://localhost:5678 → Menu → Import → select AppointmentSystem.json
```

**`backend/.env`**
```
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017/appointmentsdb?authSource=admin
```

### MongoDB — Inspect Data
```powershell
docker exec -it mongo-appointments mongosh "mongodb://admin:admin123@localhost:27017/appointmentsdb?authSource=admin"
```
```js
db.barbers.countDocuments()
db.appointments.countDocuments()
db.appointments.find().sort({ _id: -1 }).limit(3).pretty()
db.barbers.find().pretty()
```

---

## API Endpoints (Postman)

### Barbers
| Action | Method | URL | Body |
|---|---|---|---|
| Create | POST | `/api/barbers` | `{"name": "Juan"}` |
| List | GET | `/api/barbers` | — |
| Deactivate | DELETE | `/api/barbers/:id` | — |

### Appointments
| Action | Method | URL |
|---|---|---|
| Create | POST | `/api/appointments` |
| List (filter by date/barber) | GET | `/api/appointments?date=YYYY-MM-DD&barberId=ID` |
| Cancel | PUT | `/api/appointments/:id/cancel` |

**Create appointment body:**
```json
{
  "customerName": "Demo Client",
  "customerPhone": "+57 3000000000",
  "barberId": "REPLACE_WITH_REAL_ID",
  "start": "2026-02-26T14:00:00.000Z",
  "durationMin": 30
}
```

**Validations triggered:**
- `400` — invalid duration (only 30, 45, 60), invalid phone format, missing fields
- `404` — barber not found or inactive
- `409` — time slot already booked (overlap detection)

---

## n8n Agent — Appointment Assistant

**Webhook URL (Test mode):** `POST http://localhost:5678/webhook-test/appointment-agent`

**Behavior A — List appointments:**
```json
{ "message": "Do I have appointments today?", "date": "2026-02-26" }
```
→ Returns a concise list: `time | customer | barber`

**Behavior B — Send reminders:**
```json
{ "message": "Please send reminders to my clients", "date": "2026-02-26" }
```
→ Returns simulated SMS text per client (no real SMS required)

> **Import:** `AppointmentSystem.json` (root folder) → n8n Menu → Import
