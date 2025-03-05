"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const db_1 = __importDefault(require("./db"));
const sync_1 = require("./sync");
const App = () => {
    const [patients, setPatients] = (0, react_1.useState)([]);
    const [name, setName] = (0, react_1.useState)('');
    const [dob, setDob] = (0, react_1.useState)('');
    const [medicalId, setMedicalId] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        fetchLocalPatients();
        (0, sync_1.setToken)('your-jwt-token'); // Replace with login logic
        (0, sync_1.syncPatients)(1).catch(console.error); // Replace 1 with dynamic hospital_id
    }, []);
    const fetchLocalPatients = () => {
        db_1.default.all('SELECT * FROM patients', (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }
            setPatients(rows);
        });
    };
    const addPatient = () => {
        db_1.default.run('INSERT INTO patients (hospital_id, name, dob, medical_id, synced) VALUES (?, ?, ?, ?, 0)', [1, name, dob, medicalId], // Replace 1 with dynamic hospital_id
        (err) => {
            if (err) {
                console.error(err);
                return;
            }
            fetchLocalPatients();
            (0, sync_1.syncPatients)(1).catch(console.error);
            setName('');
            setDob('');
            setMedicalId('');
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "EMR Desktop" }), (0, jsx_runtime_1.jsx)("input", { value: name, onChange: e => setName(e.target.value), placeholder: "Name" }), (0, jsx_runtime_1.jsx)("input", { value: dob, onChange: e => setDob(e.target.value), placeholder: "DOB (YYYY-MM-DD)" }), (0, jsx_runtime_1.jsx)("input", { value: medicalId, onChange: e => setMedicalId(e.target.value), placeholder: "Medical ID" }), (0, jsx_runtime_1.jsx)("button", { onClick: addPatient, children: "Add Patient" }), (0, jsx_runtime_1.jsx)("ul", { children: patients.map(patient => ((0, jsx_runtime_1.jsxs)("li", { children: [patient.name, " - ", patient.medical_id, " (", patient.synced ? 'Synced' : 'Pending', ")"] }, patient.id))) })] }));
};
exports.default = App;
