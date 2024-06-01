import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs,setDoc } from 'firebase/firestore';
import '../css/style.css';

const AdminSelect = () => {
  const [selectedCollege, setSelectedCollege] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [days, setDays] = useState([]);
  const [timeslots, setTimeslots] = useState({});
  const [levelData, setLevelData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeslot, setSelectedTimeslot] = useState('');
  const [updateData, setUpdateData] = useState({
    teacher: '',
    module: '',
    class: ''
  });
  const [error, setError] = useState('');

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
  };

  const timeslotLabels = [
    "08:00 - 09:30",
    "09:30 - 11:00",
    "11:00 - 12:30",
    "12:30 - 14:00",
    "14:00 - 15:30",
    "15:30 - 17:00"
  ];

  const userData = JSON.parse(localStorage.getItem('user'));
  const adminSubtitle = `Welcome ${userData.name}`


  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleTimeslotChange = (event) => {
    setSelectedTimeslot(event.target.value);
  };

  const handleUpdateInputChange = (event) => {
    setUpdateData({
      ...updateData,
      [event.target.name]: event.target.value
    });
  };

  const handleUpdate = async () => {
    if (!selectedDay || !selectedTimeslot || !selectedCollege || !selectedDepartment || !selectedLevel) {
      setError('Please select all required fields.');
      return;
    }
  
    try {
      // Reference to the selected timeslot document
      const timeslotDocRef = doc(
        db,
        'Faculties',
        selectedCollege,
        'Departments',
        selectedDepartment,
        'Levels',
        selectedLevel,
        'Days',
        selectedDay,
        'Timeslots',
        selectedTimeslot
      );
  
      // Check if the selected class is reserved in the same department across all levels
      let isReserved = false;
  
      for (const level of studentLevels) {
        const levelTimeslotDocRef = doc(
          db,
          'Faculties',
          selectedCollege,
          'Departments',
          selectedDepartment,
          'Levels',
          level,
          'Days',
          selectedDay,
          'Timeslots',
          selectedTimeslot
        );
  
        const levelTimeslotDoc = await getDoc(levelTimeslotDocRef);
        if (levelTimeslotDoc.exists() && levelTimeslotDoc.data().class === updateData.class) {
          isReserved = true;
          break;
        }
      }
  
      if (isReserved) {
        alert('The selected class is already reserved in this timeslot.');
      } else {
        // Update the selected timeslot with the provided information
        await setDoc(timeslotDocRef, {
          teacher: updateData.teacher,
          module: updateData.module,
          class: updateData.class
        });  
        alert('Timeslot updated successfully.');
        // Optionally, you can refresh the timetable to reflect the update
      }
    } catch (error) {
      console.error('Error updating timeslot:', error);
      setError('An error occurred while updating the timeslot.');
    }
  };
  
  

  const handleDelete = async () => {
    if (selectedDay && selectedTimeslot) {
      const timeslotDocRef = doc(
        db,
        'Faculties',
        selectedCollege,
        'Departments',
        selectedDepartment,
        'Levels',
        selectedLevel,
        'Days',
        selectedDay,
        'Timeslots',
        selectedTimeslot
      );

      try {
        await setDoc(timeslotDocRef, {
          teacher: '',
          module: '',
          class: ''
        });
        alert('Delete successful!');
        setError((prevError) => (prevError ? '' : prevError));
      } catch (error) {
        console.error('Error deleting timeslot:', error);
        setError('An error occurred while deleting the timeslot.');
      }
    }
  };
    
  return (
    <div className="levels">
      <div className="container">
        <div className="levels-content">
        <h1 className='admin-title'>Admin Panel</h1>
          <h2 className='admin-subtitle'> {adminSubtitle} </h2>
          <p className='admin-subtitle2'>Select College, Department and Level and manage your planning</p>
          <div className="input-box">
            <select name="college" id="college" onChange={handleCollegeChange} value={selectedCollege}>
              <option value="" hidden>Select College</option>
              {Object.keys(colleges).map((college) => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>
          <div className="input-box">
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
          </div>
          <button
            className="start-btn"
            style={{ marginTop: "10px" }}
            onClick={handleSubmit}
            disabled={!selectedCollege || !selectedDepartment || !selectedLevel}
          >
            Submit
          </button>
        </div>
        {days.length > 0 && (
          <div className="timetable pd-y">
            <h2 className="timetable-title" style={{ marginBottom: "20px"}}>{selectedDepartment}-{selectedLevel}</h2>
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
            <h4 className="change-desc">Do you want to update or delete your time? select the day and hour</h4>
            <div>
              <div className="input-box">
                <select name="day" id="day" onChange={handleDayChange} value={selectedDay}>
                  <option value="" hidden>Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-box" style={{margin: '20px 0'}}>
                <select
                  name="timeslot"
                  id="timeslot"
                  onChange={handleTimeslotChange}
                  value={selectedTimeslot}
                  disabled={!selectedDay}
                >
                  <option value="" hidden>Select Timeslot</option>
                  {timeslotLabels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedDay && selectedTimeslot && (
              <div>
                {updateData && (
                  <div>
                    <div className="input-box">
                      <input
                        type="text"
                        name="teacher"
                        placeholder="Teacher"
                        value={updateData.teacher}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="input-box">
                      <input
                        type="text"
                        name="module"
                        placeholder="Module"
                        value={updateData.module}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="input-box">
                      <input
                        type="text"
                        name="class"
                        placeholder="Class"
                        value={updateData.class}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                  </div>
                )}
                <button className='start-btn' onClick={handleUpdate} style={{margin: '30px 0'}}>Update</button> <br />
                <button className='start-btn' onClick={handleDelete} style={{marginTop: '30px'}}>Delete</button>
              </div>
            )}
            {error && <div className={`err ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSelect;
