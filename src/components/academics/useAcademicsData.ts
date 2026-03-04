"use client";

import * as React from "react";
import type {
  CourseItem, LectureNote, MajorPlan, ResourceItem,
  SemesterBucket, ToastType, Assignment, ExamItem,
  StudyGroup, UniCartClass
} from "./constants";
import { LS_KEY } from "./constants";
import { makeId, norm, loadState, saveState } from "./utils";
import { seedSemesters, seedSelectedSemesterId, mockMajors, mockStudyGroups, mockClassLibrary, mockStudentProfiles } from "./mockData";

export function useAcademicsData() {
  // ── Core semester state ──────────────────────────────────────────────────
  const [semesters, setSemesters] = React.useState<SemesterBucket[]>(seedSemesters);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(seedSelectedSemesterId);
  const [toast, setToast] = React.useState<{ type: ToastType; text: string } | null>(null);
  const [tab, setTab] = React.useState<0 | 1 | 2 | 3>(0);

  // ── Add-course form ──────────────────────────────────────────────────────
  const [addSubject, setAddSubject] = React.useState("COMP");
  const [addNumber, setAddNumber] = React.useState("");
  const [addTitle, setAddTitle] = React.useState("");
  const [addProfessor, setAddProfessor] = React.useState("");
  const [addUnits, setAddUnits] = React.useState("3");
  const [newSemName, setNewSemName] = React.useState("");

  // ── Course modal (replaces drawer) ──────────────────────────────────────
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTab, setModalTab] = React.useState<0 | 1 | 2 | 3>(0);
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);

  // ── Note form ────────────────────────────────────────────────────────────
  const [noteAuthor, setNoteAuthor] = React.useState("");
  const [noteTopic, setNoteTopic] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  const [noteIsPublic, setNoteIsPublic] = React.useState(false);

  // ── Search ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState("");

  // ── Resource form ────────────────────────────────────────────────────────
  const [resourceLabel, setResourceLabel] = React.useState("");
  const [resourceUrl, setResourceUrl] = React.useState("");
  const [resourceIsPublic, setResourceIsPublic] = React.useState(false);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filterSubject, setFilterSubject] = React.useState("");
  const [filterDays, setFilterDays] = React.useState<string[]>([]);
  const [filterUnits, setFilterUnits] = React.useState("");
  const [filterOnline, setFilterOnline] = React.useState<"all" | "online" | "in-person">("all");

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

  // Load majors when Majors tab is opened
  React.useEffect(() => {
    if (tab === 1 && majors.length === 0) setMajors(mockMajors);
  }, [tab, majors.length]);

  // ── Derived state ────────────────────────────────────────────────────────
  const selectedSemester = React.useMemo(
    () => semesters.find((s) => s.id === selectedSemesterId) ?? semesters[0],
    [semesters, selectedSemesterId]
  );

  const filteredCourses = React.useMemo(() => {
    let courses = selectedSemester?.courses ?? [];
    if (filterSubject) courses = courses.filter((c) => c.subject.toLowerCase().includes(filterSubject.toLowerCase()));
    if (filterUnits) courses = courses.filter((c) => String(c.units) === filterUnits);
    if (filterDays.length) courses = courses.filter((c) => filterDays.some((d) => c.days?.includes(d)));
    if (filterOnline === "online") courses = courses.filter((c) => c.isOnline);
    if (filterOnline === "in-person") courses = courses.filter((c) => !c.isOnline);
    return courses;
  }, [selectedSemester, filterSubject, filterUnits, filterDays, filterOnline]);

  const activeCourse = React.useMemo(() => {
    if (!activeCourseId || !selectedSemester) return null;
    return selectedSemester.courses.find((c) => c.id === activeCourseId) ?? null;
  }, [activeCourseId, selectedSemester]);

  const searchedNotes = React.useMemo(() => {
    if (!activeCourse) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activeCourse.notes;
    const words = q.split(/\s+/).filter(Boolean);
    return activeCourse.notes.filter((n) => {
      const hay = `${n.topicTitle} ${n.body} ${n.author}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [activeCourse, searchQuery]);

  // All upcoming assignments across all courses in selected semester
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

  // UniCart filtered class library
  const filteredClassLibrary = React.useMemo(() => {
    let list = mockClassLibrary.filter((c) => c.semester === cartSemester);
    if (classSearchQuery) {
      const q = classSearchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          `${c.subject} ${c.number} ${c.title} ${c.professor}`.toLowerCase().includes(q)
      );
    }
    if (cartModeFilter === "online") list = list.filter((c) => c.isOnline);
    if (cartModeFilter === "in-person") list = list.filter((c) => !c.isOnline);
    return list;
  }, [cartSemester, classSearchQuery, cartModeFilter]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const openCourseModal = React.useCallback((courseId: string, openTab: 0 | 1 | 2 | 3) => {
    setActiveCourseId(courseId);
    setModalTab(openTab);
    setModalOpen(true);
    setNoteAuthor("");
    setNoteTopic("");
    setNoteBody("");
    setNoteIsPublic(false);
    setSearchQuery("");
    setResourceLabel("");
    setResourceUrl("");
    setResourceIsPublic(false);
  }, []);

  const handleAddCourse = React.useCallback(() => {
    const subject = norm(addSubject).toUpperCase();
    const number = norm(addNumber);
    if (!subject || !number) {
      setToast({ type: "warning", text: "Please enter a Subject and Number (ex: COMP 333)." });
      return;
    }
    const exists = selectedSemester.courses.some(
      (c) => c.subject.toUpperCase() === subject && c.number === number
    );
    if (exists) {
      setToast({ type: "warning", text: `${subject} ${number} already exists in ${selectedSemester.id}.` });
      return;
    }
    const newCourse: CourseItem = {
      id: makeId(),
      subject,
      number,
      title: norm(addTitle) || undefined,
      professor: norm(addProfessor) || undefined,
      units: Number(addUnits) || 3,
      semester: selectedSemester.id,
      notes: [],
      resources: [],
      assignments: [],
      exams: [],
    };
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === selectedSemester.id ? { ...s, courses: [newCourse, ...s.courses] } : s
      )
    );
    setAddNumber("");
    setAddTitle("");
    setAddProfessor("");
    setToast({ type: "success", text: `Added ${subject} ${number} to ${selectedSemester.id}.` });
  }, [addSubject, addNumber, addTitle, addProfessor, addUnits, selectedSemester]);

  const handleAddSemester = React.useCallback(() => {
    const name = norm(newSemName);
    if (!name) {
      setToast({ type: "warning", text: "Type a semester name like: Fall 2026" });
      return;
    }
    if (semesters.some((s) => s.id.toLowerCase() === name.toLowerCase())) {
      setToast({ type: "warning", text: "That semester already exists." });
      return;
    }
    setSemesters((prev) => [{ id: name, courses: [] }, ...prev]);
    setSelectedSemesterId(name);
    setNewSemName("");
    setToast({ type: "success", text: `Created semester: ${name}` });
  }, [newSemName, semesters]);

  const postNote = React.useCallback(() => {
    if (!activeCourse) return;
    const topicTitle = norm(noteTopic);
    const body = norm(noteBody);
    if (!topicTitle || !body) {
      setToast({ type: "warning", text: "Add a Topic Title and note content." });
      return;
    }
    const newNote: LectureNote = {
      id: makeId(),
      author: norm(noteAuthor) || "Anonymous",
      topicTitle,
      body,
      createdAt: new Date().toISOString(),
      isPublic: noteIsPublic,
    };
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) =>
            c.id === activeCourse.id ? { ...c, notes: [newNote, ...c.notes] } : c
          ),
        };
      })
    );
    setNoteTopic("");
    setNoteBody("");
    setToast({ type: "success", text: `Posted ${noteIsPublic ? "public" : "private"} note.` });
  }, [activeCourse, selectedSemester, noteAuthor, noteTopic, noteBody, noteIsPublic]);

  const addResourceLink = React.useCallback(() => {
    if (!activeCourse) return;
    const label = norm(resourceLabel) || "Resource link";
    const url = norm(resourceUrl);
    if (!url) {
      setToast({ type: "warning", text: "Paste a URL to add a resource link." });
      return;
    }
    const item: ResourceItem = {
      id: makeId(),
      label,
      url,
      isPublic: resourceIsPublic,
      createdAt: new Date().toISOString(),
    };
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) =>
            c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c
          ),
        };
      })
    );
    setResourceLabel("");
    setResourceUrl("");
    setToast({ type: "success", text: "Added resource link." });
  }, [activeCourse, selectedSemester, resourceLabel, resourceUrl, resourceIsPublic]);

  const addResourceFile = React.useCallback(
    (file: File) => {
      if (!activeCourse) return;
      const objectUrl = URL.createObjectURL(file);
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const item: ResourceItem = {
        id: makeId(),
        label: norm(resourceLabel) || file.name,
        url: objectUrl,
        fileName: file.name,
        fileType: ext,
        isPublic: resourceIsPublic,
        createdAt: new Date().toISOString(),
      };
      setSemesters((prev) =>
        prev.map((s) => {
          if (s.id !== selectedSemester.id) return s;
          return {
            ...s,
            courses: s.courses.map((c) =>
              c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c
            ),
          };
        })
      );
      setResourceLabel("");
      setToast({ type: "success", text: "Attached file (session only until backend is connected)." });
    },
    [activeCourse, selectedSemester, resourceLabel, resourceIsPublic]
  );

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

  // Study group actions
  const createStudyGroup = React.useCallback(() => {
    const parts = sgCourse.trim().split(/\s+/);
    const courseSubject = parts[0]?.toUpperCase() ?? "";
    const courseNumber = parts[1] ?? "";
    if (!courseSubject || !courseNumber || !sgTopic || !sgDateTime || !sgLocation) {
      setToast({ type: "warning", text: "Please fill in all required fields." });
      return;
    }
    const newGroup: StudyGroup = {
      id: makeId(),
      courseSubject,
      courseNumber,
      topic: sgTopic,
      dateTime: new Date(sgDateTime).toISOString(),
      location: sgLocation,
      isVirtual: sgIsVirtual,
      meetingLink: sgIsVirtual ? sgMeetingLink : undefined,
      members: [{ id: makeId(), name: sgCreator || "You" }],
      createdBy: sgCreator || "You",
      createdAt: new Date().toISOString(),
      maxMembers: Number(sgMaxMembers) || 6,
      notes: sgNotes || undefined,
    };

    // TODO (backend – Supabase): Insert into `study_groups` table
    // const { data, error } = await supabase.from("study_groups").insert([newGroup]);
    // Then refresh the list from the database instead of local state

    setStudyGroups((prev) => [newGroup, ...prev]);
    setSgFormOpen(false);
    setSgCourse("");
    setSgTopic("");
    setSgDateTime("");
    setSgLocation("");
    setSgIsVirtual(false);
    setSgMeetingLink("");
    setSgMaxMembers("6");
    setSgNotes("");
    setSgCreator("");
    setToast({ type: "success", text: "Study group created!" });
  }, [sgCourse, sgTopic, sgDateTime, sgLocation, sgIsVirtual, sgMeetingLink, sgMaxMembers, sgNotes, sgCreator]);

  const joinStudyGroup = React.useCallback((groupId: string, name: string) => {
    // TODO (backend – Supabase): Insert into `study_group_members` join table
    // const { error } = await supabase.from("study_group_members").insert([{ group_id: groupId, user_id: currentUser.id }]);

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

  // UniCart actions
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
    // TODO (backend): Fetch majors from CSUN curriculum API
    // GET https://www.csun.edu/web-dev/api/curriculum/2.0/plans
    setMajors(mockMajors);
  }, []);

  return {
    // semester
    semesters, setSemesters, selectedSemesterId, setSelectedSemesterId,
    selectedSemester, filteredCourses,
    // ui
    toast, setToast, tab, setTab,
    // add course form
    addSubject, setAddSubject, addNumber, setAddNumber,
    addTitle, setAddTitle, addProfessor, setAddProfessor,
    addUnits, setAddUnits, newSemName, setNewSemName,
    // modal
    modalOpen, setModalOpen, modalTab, setModalTab, activeCourseId,
    activeCourse,
    // notes
    noteAuthor, setNoteAuthor, noteTopic, setNoteTopic,
    noteBody, setNoteBody, noteIsPublic, setNoteIsPublic,
    // search
    searchQuery, setSearchQuery, searchedNotes,
    // resources
    resourceLabel, setResourceLabel, resourceUrl, setResourceUrl,
    resourceIsPublic, setResourceIsPublic,
    // filters
    filterSubject, setFilterSubject, filterDays, setFilterDays,
    filterUnits, setFilterUnits, filterOnline, setFilterOnline,
    // due dates
    upcomingAssignments, upcomingExams, toggleAssignment,
    // majors
    majorsLoading: false, majorsErr: null, majors, majorFilter, setMajorFilter,
    selectedMajor, setSelectedMajor, loadMajors,
    majorsFiltered: React.useMemo(() => {
      const q = majorFilter.trim().toLowerCase();
      if (!q) return majors;
      return majors.filter((m) =>
        `${m.plan_title} ${m.plan_id} ${m.academic_groups_title ?? ""}`.toLowerCase().includes(q)
      );
    }, [majors, majorFilter]),
    // actions
    openCourseModal, handleAddCourse, handleAddSemester,
    postNote, addResourceLink, addResourceFile,
    // study groups
    studyGroups, sgFormOpen, setSgFormOpen,
    sgCourse, setSgCourse, sgTopic, setSgTopic,
    sgDateTime, setSgDateTime, sgLocation, setSgLocation,
    sgIsVirtual, setSgIsVirtual, sgMeetingLink, setSgMeetingLink,
    sgMaxMembers, setSgMaxMembers, sgNotes, setSgNotes,
    sgCreator, setSgCreator,
    createStudyGroup, joinStudyGroup,
    // unicart
    cartClasses, cartSemester, setCartSemester,
    cartModeFilter, setCartModeFilter,
    classSearchQuery, setClassSearchQuery,
    filteredClassLibrary, matchedProfiles,
    addToCart, removeFromCart,
  };
}
