const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

let items = [
  {
    student: {
      first_name: "Isabella ",
      last_name: "Smith"
    },
    meeting_point: "Paris",
    date: "2024-02-01T10:00:00Z",
    status: "Recherche de place"
  },
  {
    student: {
      first_name: "Franziska",
      last_name: "Smith"
    },
    meeting_point: "Lyon",
    date: "2024-02-02T14:00:00Z",
    status: "Confirmé"
  },
  {
    student: {
      first_name: "Lucas",
      last_name: "Robert"
    },
    meeting_point: "Martigues",
    date: "2024-02-03T09:00:00Z",
    status: "A organiser"
  },
  {
    student: {
      first_name: "Léo",
      last_name: "Cane"
    },
    meeting_point: "Martigues",
    date: "2024-02-03T09:00:00Z",
    status: "Annulé"
  },
  {
    student: {
      first_name: "Raphaël",
      last_name: "Bertrand"
    },
    meeting_point: "Martigues",
    date: "2024-02-03T09:00:00Z",
    status: "Recherche de place"
  },
  {
    student: {
      first_name: "Thibault",
      last_name: "Vidal"
    },
    meeting_point: "Martigues",
    date: "2024-02-03T09:00:00Z",
    status: "Annulé"
  }
];

app.get('/api/exams', (req, res) => {
  res.json(items);
});

app.post('/api/exams', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});