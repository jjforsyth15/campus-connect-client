"use client";

import * as React from "react";
import type {
  CourseItem, LectureNote, MajorPlan, ResourceItem,
  SemesterBucket, ToastType, Assignment, ExamItem,
  StudyGroup, UniCartClass, CardColorValue
} from "./shared/constants";
import { LS_KEY } from "./shared/constants";
import { makeId, norm, loadState, saveState } from "./shared/utils";
import { seedSemesters, seedSelectedSemesterId, mockMajors, mockStudyGroups, mockClassLibrary, mockStudentProfiles } from "./shared/mockData";

export function useAcademicsData() {
  // ── Core semester state ──────────────────────────────────────────────────
  const [semesters, setSemesters] = React.useState<SemesterBucket[]>(seedSemesters);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(seedSelectedSemesterId);
  const [toast, setToast] = React.useState<{ type: ToastType; text: string } | null>(null);
  const [tab, setTab] = React.useState<number>(0);

  // ── Add-course form ──────────────────────────────────────────────────────
  const [addSubject, setAddSubject] = React.useState("COMP");
  const [addNumber, setAddNumber] = React.useState("");
  const [addTitle, setAddTitle] = React.useState("");
  const [addProfessor, setAddProfessor] = React.useState("");
  const [addUnits, setAddUnits] = React.useState("3");
  const [newSemName, setNewSemName] = React.useState("");

  // ── Course modal ─────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTab, setModalTab] = React.useState<number>(0);
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);

  // ── Note form ────────────────────────────────────────────────────────────
  const [noteAuthor, setNoteAuthor] = React.useState("");
  const [noteTopic, setNoteTopic] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");

  // ── Resource form ────────────────────────────────────────────────────────
  const [resourceLabel, setResourceLabel] = React.useState("");
  const [resourceUrl, setResourceUrl] = React.useState("");

  // ── Majors ───────────────────────────────────────────────────────────────
  const [majors, setMajors] = React.useState<MajorPlan[]>([]);
  const [majorFilter, setMajorFilter] = React.useState("");
  const [selectedMajor, setSelectedMajor] = React.useState<MajorPlan | null>(null);

  // ── Study Groups ─────────────────────────────────────────────────────────
  const [studyGroups, setStudyGroups] = React.useState<StudyGroup[]>(mockStudyGroups);
  const [sgFormOpen, setSgFormOpen] = React.useState(false);
  const [sgCourse, setSgCourse] = React.useState("");
  const [sgTopic, setSgTopic] = React.useState("");
  const [sgDateTime, setSgDateTime] = React.useState("");
  const [sgLocation, setSgLocation] = React.useState("");
  const [sgIsVirtual, setSgIsVirtual] = React.useState(false);
  const [sgMeetingLink, setSgMeetingLink] = React.useState("");
  const [sgMaxMembers, setSgMaxMembers] = React.useState("6");
  const [sgNotes, setSgNotes] = React.useState("");
  const [sgCreator, setSgCreator] = React.useState("");

  // ── UniCart ──────────────────────────────────────────────────────────────
  const [cartClasses, setCartClasses] = React.useState<UniCartClass[]>([]);
  const [cartSemester, setCartSemester] = React.useState("Spring 2026");
  const [cartModeFilter, setCartModeFilter] = React.useState<"all" | "online" | "in-person">("all");
  const [classSearchQuery, setClassSearchQuery] = React.useState("");
  const [matchedProfiles] = React.useState(mockStudentProfiles);

  // ── Persist state ────────────────────────────────────────────────────────
  React.useEffect(() => {
    const loaded = loadState(LS_KEY);
    if (loaded?.semesters?.length) setSemesters(loaded.semesters);
    if (loaded?.selectedSemesterId) setSelectedSemesterId(loaded.selectedSemesterId);
  }, []);

  React.useEffect(() => {
    saveState(LS_KEY, { semesters, selectedSemesterId });
  }, [semesters, selectedSemesterId]);

  // Load majors on first visit to majors tab
  React.useEffect(() => {
    if (tab === 1 && majors.length === 0) setMajors(mockMajors);
  }, [tab, majors.length]);

  // ── Derived state ────────────────────────────────────────────────────────
  const selectedSemester = React.useMemo(
    () => semesters.find((s) => s.id === selectedSemesterId) ?? semesters[0],
    [semesters, selectedSemesterId]
  );

  const filteredCourses = selectedSemester?.courses ?? [];

  const activeCourse = React.useMemo(() => {
    if (!activeCourseId || !selectedSemester) return null;
    return selectedSemester.courses.find((c) => c.id === activeCourseId) ?? null;
  }, [activeCourseId, selectedSemester]);

  const searchedNotes = React.useMemo(() => {
    if (!activeCourse) return [];
    return activeCourse.notes;
  }, [activeCourse]);

  const upcomingAssignments = React.useMemo(() => {
    const all: Array<Assignment & { courseCode: string }> = [];
    for (const c of selectedSemester?.courses ?? []) {
      for (const a of c.assignments ?? []) {
        all.push({ ...a, courseCode: `${c.subject} ${c.number}` });
      }
    }
    return all.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [selectedSemester]);

  const upcomingExams = React.useMemo(() => {
    const all: Array<ExamItem & { courseCode: string }> = [];
    for (const c of selectedSemester?.courses ?? []) {
      for (const e of c.exams ?? []) {
        all.push({ ...e, courseCode: `${c.subject} ${c.number}` });
      }
    }
    return all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedSemester]);

  const filteredClassLibrary = React.useMemo(() => {
    let list = mockClassLibrary.filter((c) => c.semester === cartSemester);
    if (classSearchQuery) {
      const q = classSearchQuery.toLowerCase();
      list = list.filter((c) => `${c.subject} ${c.number} ${c.title} ${c.professor} ${(c.tags ?? []).join(" ")}`.toLowerCase().includes(q));
    }
    if (cartModeFilter === "online") list = list.filter((c) => c.isOnline);
    if (cartModeFilter === "in-person") list = list.filter((c) => !c.isOnline);
    return list;
  }, [cartSemester, classSearchQuery, cartModeFilter]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const openCourseModal = React.useCallback((courseId: string, openTab: number) => {
    setActiveCourseId(courseId);
    setModalTab(openTab);
    setModalOpen(true);
    setNoteAuthor("");
    setNoteTopic("");
    setNoteBody("");
    setResourceLabel("");
    setResourceUrl("");
  }, []);

  const handleAddCourse = React.useCallback(() => {
    const subject = norm(addSubject).toUpperCase();
    const number = norm(addNumber);
    if (!subject || !number) {
      setToast({ type: "warning", text: "Subject and Number are required (e.g. COMP 333)." });
      return;
    }
    const exists = selectedSemester.courses.some(
      (c) => c.subject.toUpperCase() === subject && c.number === number
    );
    if (exists) {
      setToast({ type: "warning", text: `${subject} ${number} is already in ${selectedSemester.id}.` });
      return;
    }
    const newCourse: CourseItem = {
      id: makeId(),
      subject,
      number,
      title: norm(addTitle) || undefined,
      professor: norm(addProfessor) || undefined,
      units: Number(addUnits) || 3,
      semester: selectedSemesterId,
      isOnline: false,
      cardColor: "default",
      notes: [],
      resources: [],
      assignments: [],
      exams: [],
    };
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === selectedSemesterId ? { ...s, courses: [...s.courses, newCourse] } : s
      )
    );
    setAddNumber("");
    setAddTitle("");
    setAddProfessor("");
    setAddUnits("3");
    setToast({ type: "success", text: `Added ${subject} ${number} to ${selectedSemesterId}.` });
  }, [addSubject, addNumber, addTitle, addProfessor, addUnits, selectedSemesterId, selectedSemester]);

  const handleAddSemester = React.useCallback(() => {
    const name = norm(newSemName);
    if (!name) { setToast({ type: "warning", text: "Semester name required." }); return; }
    if (semesters.some((s) => s.id === name)) { setToast({ type: "warning", text: "Semester already exists." }); return; }
    setSemesters((prev) => [...prev, { id: name, courses: [] }]);
    setSelectedSemesterId(name);
    setNewSemName("");
    setToast({ type: "success", text: `Created ${name}.` });
  }, [newSemName, semesters]);

  const setCourseColor = React.useCallback((courseId: string, color: CardColorValue) => {
    setSemesters((prev) =>
      prev.map((s) => ({
        ...s,
        courses: s.courses.map((c) => c.id === courseId ? { ...c, cardColor: color } : c),
      }))
    );
  }, []);

  const postNote = React.useCallback(() => {
    if (!activeCourse || !norm(noteTopic) || !norm(noteBody)) {
      setToast({ type: "warning", text: "Topic and note body are required." });
      return;
    }
    const note: LectureNote = {
      id: makeId(),
      author: norm(noteAuthor) || "Anonymous",
      topicTitle: norm(noteTopic),
      body: norm(noteBody),
      createdAt: new Date().toISOString(),
      isPublic: false,
    };
    setSemesters((prev) =>
      prev.map((s) => ({
        ...s,
        courses: s.courses.map((c) =>
          c.id === activeCourse.id ? { ...c, notes: [note, ...c.notes] } : c
        ),
      }))
    );
    setNoteAuthor("");
    setNoteTopic("");
    setNoteBody("");
    setToast({ type: "success", text: "Note posted." });
  }, [activeCourse, noteAuthor, noteTopic, noteBody]);

  const toggleAssignment = React.useCallback((courseId: string, assignmentId: string) => {
    setSemesters((prev) =>
      prev.map((s) => ({
        ...s,
        courses: s.courses.map((c) => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            assignments: (c.assignments ?? []).map((a) =>
              a.id === assignmentId ? { ...a, completed: !a.completed } : a
            ),
          };
        }),
      }))
    );
  }, []);

  const createStudyGroup = React.useCallback(() => {
    const parts = sgCourse.trim().split(/\s+/);
    const courseSubject = parts[0]?.toUpperCase() ?? "";
    const courseNumber = parts[1] ?? "";
    if (!courseSubject || !courseNumber || !sgTopic || !sgDateTime) {
      setToast({ type: "warning", text: "Please fill in all required fields." });
      return;
    }
    const now = new Date();
    const groupTime = new Date(sgDateTime);
    const expiresAt = new Date(groupTime.getTime() + 3 * 86400000).toISOString();
    const newGroup: StudyGroup = {
      id: makeId(),
      courseSubject, courseNumber,
      topic: sgTopic,
      dateTime: groupTime.toISOString(),
      location: sgLocation,
      isVirtual: sgIsVirtual,
      meetingLink: sgIsVirtual ? sgMeetingLink : undefined,
      members: [{ id: makeId(), name: sgCreator || "You" }],
      createdBy: sgCreator || "You",
      createdAt: now.toISOString(),
      maxMembers: Number(sgMaxMembers) || 6,
      notes: sgNotes || undefined,
      expiresAt,
    };
    // TODO (backend – Supabase): Insert into study_groups table
    setStudyGroups((prev) => [newGroup, ...prev]);
    setSgFormOpen(false);
    setSgCourse(""); setSgTopic(""); setSgDateTime(""); setSgLocation("");
    setSgIsVirtual(false); setSgMeetingLink(""); setSgMaxMembers("6"); setSgNotes(""); setSgCreator("");
    setToast({ type: "success", text: "Study group created! It will expire 3 days after the session." });
  }, [sgCourse, sgTopic, sgDateTime, sgLocation, sgIsVirtual, sgMeetingLink, sgMaxMembers, sgNotes, sgCreator]);

  const joinStudyGroup = React.useCallback((groupId: string, name: string) => {
    // TODO (backend – Supabase): Insert into study_group_members table
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (g.members.some((m) => m.name === name)) return g;
        if (g.maxMembers && g.members.length >= g.maxMembers) return g;
        return { ...g, members: [...g.members, { id: makeId(), name: name || "You" }] };
      })
    );
    setToast({ type: "success", text: "Joined study group!" });
  }, []);

  const addToCart = React.useCallback((cls: UniCartClass) => {
    setCartClasses((prev) => {
      if (prev.some((c) => c.id === cls.id)) return prev;
      return [...prev, cls];
    });
    setToast({ type: "success", text: `Added ${cls.subject} ${cls.number} to your cart.` });
  }, []);

  const removeFromCart = React.useCallback((classId: string) => {
    setCartClasses((prev) => prev.filter((c) => c.id !== classId));
  }, []);

  const loadMajors = React.useCallback(() => {
    // TODO (backend): GET https://www.csun.edu/web-dev/api/curriculum/2.0/plans
    setMajors(mockMajors);
  }, []);

  return {
    semesters, setSemesters, selectedSemesterId, setSelectedSemesterId,
    selectedSemester, filteredCourses,
    toast, setToast, tab, setTab,
    addSubject, setAddSubject, addNumber, setAddNumber,
    addTitle, setAddTitle, addProfessor, setAddProfessor,
    addUnits, setAddUnits, newSemName, setNewSemName,
    modalOpen, setModalOpen, modalTab, setModalTab, activeCourseId, activeCourse,
    noteAuthor, setNoteAuthor, noteTopic, setNoteTopic, noteBody, setNoteBody,
    searchedNotes,
    resourceLabel, setResourceLabel, resourceUrl, setResourceUrl,
    upcomingAssignments, upcomingExams, toggleAssignment,
    majorsLoading: false, majorsErr: null, majors, majorFilter, setMajorFilter,
    selectedMajor, setSelectedMajor, loadMajors,
    majorsFiltered: React.useMemo(() => {
      const q = majorFilter.trim().toLowerCase();
      if (!q) return majors;
      return majors.filter((m) => `${m.plan_title} ${m.plan_id} ${m.academic_groups_title ?? ""}`.toLowerCase().includes(q));
    }, [majors, majorFilter]),
    studyGroups, sgFormOpen, setSgFormOpen,
    sgCourse, setSgCourse, sgTopic, setSgTopic,
    sgDateTime, setSgDateTime, sgLocation, setSgLocation,
    sgIsVirtual, setSgIsVirtual, sgMeetingLink, setSgMeetingLink,
    sgMaxMembers, setSgMaxMembers, sgNotes, setSgNotes,
    sgCreator, setSgCreator,
    createStudyGroup, joinStudyGroup,
    cartClasses, cartSemester, setCartSemester,
    cartModeFilter, setCartModeFilter,
    classSearchQuery, setClassSearchQuery,
    filteredClassLibrary, matchedProfiles,
    addToCart, removeFromCart,
    openCourseModal, handleAddCourse, handleAddSemester,
    postNote, setCourseColor,
  };
}
