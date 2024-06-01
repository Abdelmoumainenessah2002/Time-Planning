import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFWEXS6-BunP2Skh4B3ojX_ZoKOrCnFcg",
  authDomain: "time-planning-508f5.firebaseapp.com",
  projectId: "time-planning-508f5",
  storageBucket: "time-planning-508f5.appspot.com",
  messagingSenderId: "1026486811556",
  appId: "1:1026486811556:web:faacbb068400289c4a1f31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const facultiesData = [
  { name: "Science & Technology", departments: ["Computer Science", "Material Sciences", "Engineering"] },
  { name: "Law & Political Science", departments: ["Public Law", "Private Law", "International Relations"] },
  { name: "Literature & Languages", departments: ["English", "French", "Arabic"] }
];

const levelsData = [
  "1st licence",
  "2nd licence",
  "3rd licence",
  "1st master",
  "2nd master",
  "phd"
];

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const timeslots = [
  "08:00 - 09:30",
  "09:30 - 11:00",
  "11:00 - 12:30",
  "12:30 - 14:00",
  "14:00 - 15:30",
  "15:30 - 17:00"
];

const createFaculties = async () => {
  try {
    await Promise.all(facultiesData.map(async faculty => {
      const facultyDocRef = doc(db, "Faculties", faculty.name);
      await setDoc(facultyDocRef, { name: faculty.name });
      await createDepartments(facultyDocRef.id, faculty.departments);
    }));
    console.log("Faculties collection created successfully.");
  } catch (error) {
    console.error("Error creating faculties collection:", error);
  }
};

const createDepartments = async (facultyId, departments) => {
  try {
    await Promise.all(departments.map(async department => {
      const departmentDocRef = doc(db, "Faculties", facultyId, "Departments", department);
      await setDoc(departmentDocRef, { name: department });
      await createLevels(facultyId, departmentDocRef.id);
    }));
  } catch (error) {
    console.error("Error creating departments:", error);
  }
};

const createLevels = async (facultyId, departmentId) => {
  try {
    await Promise.all(levelsData.map(async level => {
      const levelDocRef = doc(db, "Faculties", facultyId, "Departments", departmentId, "Levels", level);
      await setDoc(levelDocRef, { name: level });
      await createDays(facultyId, departmentId, levelDocRef.id);
    }));
    console.log("Levels created successfully.");
  } catch (error) {
    console.error("Error creating levels:", error);
  }
};

const createDays = async (facultyId, departmentId, levelId) => {
  try {
    await Promise.all(daysOfWeek.map(async day => {
      const dayDocRef = doc(db, "Faculties", facultyId, "Departments", departmentId, "Levels", levelId, "Days", day);
      await setDoc(dayDocRef, { name: day });
      await createTimeslots(facultyId, departmentId, levelId, dayDocRef.id);
    }));
    console.log("Days created successfully.");
  } catch (error) {
    console.error("Error creating days:", error);
  }
};

const createTimeslots = async (facultyId, departmentId, levelId, dayId) => {
  try {
    const timeslotsRef = collection(
      db,
      "Faculties",
      facultyId,
      "Departments",
      departmentId,
      "Levels",
      levelId,
      "Days",
      dayId,
      "Timeslots"
    );

    for (const timeslot of timeslots) {
      const timeslotData = {
        teacher: "",
        module: "",
        class: ""
      };
      await setDoc(doc(timeslotsRef, timeslot), timeslotData);
    }
    console.log("Timeslots created successfully.");
  } catch (error) {
    console.error("Error creating timeslots:", error);
  }
};

createFaculties();

