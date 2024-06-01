import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import '../css/style.css';

const Levels = () => {
  const [selectedCollege, setSelectedCollege] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [days, setDays] = useState([]);
  const [timeslots, setTimeslots] = useState({});
  const [levelData, setLevelData] = useState(null);

  const colleges = {
    "Science & Technology": ["Computer Science", "Material Sciences", "Engineering"],
    "Law & Political Science": ["Public Law", "Private Law", "International Relations"],
    "Literature & Languages": ["English", "French", "Arabic"]
  };

  const studentLevels = [
    "1st licence",
    "2nd licence",
    "3rd licence",
    "1st master",
    "2nd master",
    "phd"
  ];

  const handleCollegeChange = (event) => {
    const selectedCollege = event.target.value;
    setSelectedCollege(selectedCollege);
    setDepartments(colleges[selectedCollege] || []);
    setSelectedDepartment('');
    setSelectedLevel('');
    setLevelData(null);
    setDays([]);
    setTimeslots({});
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setSelectedDepartment(selectedDepartment);
    setSelectedLevel('');
    setLevelData(null);
    setDays([]);
    setTimeslots({});
  };

  const handleLevelChange = async (event) => {
    const selectedLevel = event.target.value;
    setSelectedLevel(selectedLevel);

    if (selectedCollege && selectedDepartment && selectedLevel) {
      const levelDocRef = doc(db, "Faculties", selectedCollege, "Departments", selectedDepartment, "Levels", selectedLevel);
      const levelDoc = await getDoc(levelDocRef);

      if (levelDoc.exists()) {
        setLevelData(levelDoc.data());

        // Fetch days
        const daysCollectionRef = collection(levelDocRef, "Days");
        const daysSnapshot = await getDocs(daysCollectionRef);
        const daysData = daysSnapshot.docs.map(doc => doc.id).sort((a, b) => {
          const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
          return dayOrder.indexOf(a) - dayOrder.indexOf(b);
        });
        setDays(daysData);

        // Fetch timeslots for each day
        const timeslotsData = {};
        for (const day of daysData) {
          const timeslotsCollectionRef = collection(daysCollectionRef, day, "Timeslots");
          const timeslotsSnapshot = await getDocs(timeslotsCollectionRef);
          timeslotsData[day] = timeslotsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        setTimeslots(timeslotsData);
      } else {
        console.error("No such document!");
        setLevelData(null);
        setDays([]);
        setTimeslots({});
      }
    }
  };

  const handleSubmit = () => {
    console.log("Selected College:", selectedCollege);
    console.log("Selected Department:", selectedDepartment);
    console.log("Selected Level:", selectedLevel);
    console.log("Level Data:", levelData);
    console.log("Days:", days);
    console.log("Timeslots:", timeslots);
  };

  const timeslotLabels = [
    "08:00 - 09:30",
    "09:30 - 11:00",
    "11:00 - 12:30",
    "12:30 - 14:00",
    "14:00 - 15:30",
    "15:30 - 17:00"
  ];

  return (
    <div className="levels">
      <div className="container">
        <div className="levels-content">
          <div className="input-box">
            <select name="college" id="college" onChange={handleCollegeChange} value={selectedCollege}>
              <option value="" hidden>Select College</option>
              {Object.keys(colleges).map((college) => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>
          <br />
          <div className="input-box" style={{margin: '20px 10px'}}>
            <select
              name="department"
              id="department"
              onChange={handleDepartmentChange}
              value={selectedDepartment}
              disabled={!selectedCollege}
            >
              <option value="" hidden>Select Department</option>
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <br />
          <div className="input-box">
            <select
              name="level"
              id="level"
              onChange={handleLevelChange}
              value={selectedLevel}
              disabled={!selectedDepartment}
            >
              <option value="" hidden>Select Level</option>
              {studentLevels.map((level, index) => (
                <option key={index} value={level}>{level}</option>
              ))}
            </select>
          </div> <br />
          <div className="input-box" style={{marginBottom: 8}}> 
            <button
              className="start-btn"
              style={{ marginTop: "10px" }}
              onClick={handleSubmit}
              disabled={!selectedCollege || !selectedDepartment || !selectedLevel}
            >
              Submit
            </button>
          </div>
        </div>
        {days.length > 0 && (
          <div className="timetable">
            <div className="timetable-grid">
              <div className="timetable-header"></div>
              {timeslotLabels.map((label, index) => (
                <div key={index} className="timetable-header">{label}</div>
              ))}
              {days.map((day) => (
                <React.Fragment key={day}>
                  <div className="timetable-day">{day}</div>
                  {timeslotLabels.map((label, index) => (
                    <div key={index} className="timetable-timeslot">
                      <div className="timeslot-teacher">
                        {timeslots[day]?.find(timeslot => timeslot.id === label)?.teacher || ''}
                      </div>
                      <div className="timeslot-module">
                        {timeslots[day]?.find(timeslot => timeslot.id === label)?.module || ''}
                      </div>
                      <div className="timeslot-class">
                        {timeslots[day]?.find(timeslot => timeslot.id === label)?.class || ''}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Levels;