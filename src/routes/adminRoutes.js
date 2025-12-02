const router = require('express').Router();
const { validateEvent } = require('../utils/validatefn');
const Event = require('../models/Events');
const { userAuth } = require('../middleware/varifyAuth');

function stringtonumber(hhmm) {
  const [hh, mm] = hhmm.split(':').map(Number);
  return hh * 60 + mm;
}

router.post('/event', userAuth, async (req, res) => {
  try {
   const user=req.user
    const isValid = validateEvent(req.body);
    if (!isValid) return res.status(400).send({ message: "Invalid event data" });

    const { title, date, startTime, endTime, venue, mode, description} = req.body;


    const startMin = stringtonumber(startTime);
    const endMin = stringtonumber(endTime);
    if (endMin <= startMin) {
      return res.status(400).send({ message: "endTime must be after startTime" });
    }
    const overlappingEvent = await Event.findOne({
      date,
      startTime: { $lt: startTime ? endTime : endTime }, 
      endTime:   { $gt: startTime }
    });

    if (overlappingEvent) {
      return res.status(400).send({
        message: "Error : it overlap another event ,"
      });
    }

    const event = new Event({
      title, description, date, venue, mode, startTime, endTime, createdBy:user.name
    });
    await event.save();
    res.status(201).send({ message: "Event created successfully", event });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});



router.put('/event/:id',userAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    const { title, description, date, startTime, endTime, venue, mode, createdBy } = payload;
    if (!title || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'title, date, startTime and endTime are required for full update' });
    }

    const isValidDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
    const isValidTime = (t) => /^\d{2}:\d{2}$/.test(t);
    if (!isValidDate(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    if (!isValidTime(startTime) || !isValidTime(endTime)) return res.status(400).json({ error: 'time must be HH:MM' });
    if (startTime >= endTime) return res.status(400).json({ error: 'startTime must be before endTime' });

    
    const existing = await Event.findById(id).lean();
    if (!existing) return res.status(404).json({ error: 'Event not found' });

    const overlap = await Event.findOne({
      date,
      _id: { $ne: id },
      $and: [
        { endTime: { $gt: startTime } },
        { startTime: { $lt: endTime } }
      ]
    }).lean();

    if (overlap) {
      return res.status(409).json({ error: 'Event overlaps ' });
    }

    
    const updated = await Event.findByIdAndUpdate(
      id,
      { title, description, date, startTime, endTime, venue, mode, createdBy },
      { new: true, runValidators: true }
    );

    return res.status(200).send({message:"event updated success fully",updated })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});





router.delete('/:id',userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid event id' });
    }

    const deleted = await Event.findByIdAndDelete(id).lean();
    console.log(deleted);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json({ success: true, deleted });
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Server error' });
  }
});

module.exports = router;
