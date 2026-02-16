"use client";

import * as React from "react";
import type { CourseItem, LectureNote, MajorPlan, ResourceItem, SemesterBucket, ToastType } from "./constants";
import { LS_KEY } from "./constants";
import { makeId, norm, loadState, saveState } from "./utils";
import { seedSemesters, seedSelectedSemesterId, mockMajors } from "./mockData";

export function useAcademicsData() {
  const [semesters, setSemesters] = React.useState<SemesterBucket[]>(seedSemesters);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(seedSelectedSemesterId);
  const [toast, setToast] = React.useState<{ type: ToastType; text: string } | null>(null);
  const [tab, setTab] = React.useState<0 | 1>(0);
  const [addSubject, setAddSubject] = React.useState("COMP");
  const [addNumber, setAddNumber] = React.useState("");
  const [addTitle, setAddTitle] = React.useState("");
  const [addProfessor, setAddProfessor] = React.useState("");
  const [newSemName, setNewSemName] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<0 | 1 | 2 | 3>(0);
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);
  const [noteAuthor, setNoteAuthor] = React.useState("");
  const [noteTopic, setNoteTopic] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [resourceLabel, setResourceLabel] = React.useState("");
  const [resourceUrl, setResourceUrl] = React.useState("");
  const [majors, setMajors] = React.useState<MajorPlan[]>([]);
  const [majorFilter, setMajorFilter] = React.useState("");
  const [selectedMajor, setSelectedMajor] = React.useState<MajorPlan | null>(null);

  React.useEffect(() => {
    const loaded = loadState(LS_KEY);
    if (loaded?.semesters?.length) setSemesters(loaded.semesters);
    if (loaded?.selectedSemesterId) setSelectedSemesterId(loaded.selectedSemesterId);
  }, []);

  React.useEffect(() => {
    saveState(LS_KEY, { semesters, selectedSemesterId });
  }, [semesters, selectedSemesterId]);

  React.useEffect(() => {
    if (tab === 1 && majors.length === 0) setMajors(mockMajors);
  }, [tab, majors.length]);

  const selectedSemester = React.useMemo(
    () => semesters.find((s) => s.id === selectedSemesterId) ?? semesters[0],
    [semesters, selectedSemesterId]
  );

  const activeCourse = React.useMemo(() => {
    if (!activeCourseId || !selectedSemester) return null;
    return selectedSemester.courses.find((c) => c.id === activeCourseId) ?? null;
  }, [activeCourseId, selectedSemester]);

  const searchedNotes = React.useMemo(() => {
    if (!activeCourse) return [];
    const q = norm(searchQuery).toLowerCase();
    if (!q) return activeCourse.notes;
    const words = q.split(/\s+/).filter(Boolean);
    return activeCourse.notes.filter((n) => {
      const hay = `${n.topicTitle} ${n.body} ${n.author}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [activeCourse, searchQuery]);

  const majorsFiltered = React.useMemo(() => {
    const q = norm(majorFilter).toLowerCase();
    if (!q) return majors;
    return majors.filter((m) => {
      const hay = `${m.plan_title} ${m.plan_id} ${m.academic_groups_title ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [majors, majorFilter]);

  const openCourseDrawer = React.useCallback((courseId: string, openTab: 0 | 1 | 2 | 3) => {
    setActiveCourseId(courseId);
    setDrawerTab(openTab);
    setDrawerOpen(true);
    setNoteAuthor("");
    setNoteTopic("");
    setNoteBody("");
    setSearchQuery("");
    setResourceLabel("");
    setResourceUrl("");
  }, []);

  const handleAddCourse = React.useCallback(() => {
    const subject = norm(addSubject).toUpperCase();
    const number = norm(addNumber);
    if (!subject || !number) {
      setToast({ type: "warning", text: "Please enter a Subject and Number (ex: COMP 333)." });
      return;
    }
    const exists = selectedSemester.courses.some((c) => c.subject.toUpperCase() === subject && c.number === number);
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
      notes: [],
      resources: [],
    };
    setSemesters((prev) =>
      prev.map((s) => (s.id === selectedSemester.id ? { ...s, courses: [newCourse, ...s.courses] } : s))
    );
    setAddNumber("");
    setAddTitle("");
    setAddProfessor("");
    setToast({ type: "success", text: `Added ${subject} ${number} to ${selectedSemester.id}.` });
  }, [addSubject, addNumber, addTitle, addProfessor, selectedSemester]);

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
    };
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) => (c.id === activeCourse.id ? { ...c, notes: [newNote, ...c.notes] } : c)),
        };
      })
    );
    setNoteTopic("");
    setNoteBody("");
    setToast({ type: "success", text: "Posted note." });
  }, [activeCourse, selectedSemester, noteAuthor, noteTopic, noteBody]);

  const addResourceLink = React.useCallback(() => {
    if (!activeCourse) return;
    const label = norm(resourceLabel) || "Resource link";
    const url = norm(resourceUrl);
    if (!url) {
      setToast({ type: "warning", text: "Paste a URL to add a resource link." });
      return;
    }
    const item: ResourceItem = { id: makeId(), label, url, createdAt: new Date().toISOString() };
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) => (c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c)),
        };
      })
    );
    setResourceLabel("");
    setResourceUrl("");
    setToast({ type: "success", text: "Added resource link." });
  }, [activeCourse, selectedSemester, resourceLabel, resourceUrl]);

  const addResourceFile = React.useCallback(
    (file: File) => {
      if (!activeCourse) return;
      const objectUrl = URL.createObjectURL(file);
      const item: ResourceItem = {
        id: makeId(),
        label: norm(resourceLabel) || file.name,
        url: objectUrl,
        fileName: file.name,
        createdAt: new Date().toISOString(),
      };
      setSemesters((prev) =>
        prev.map((s) => {
          if (s.id !== selectedSemester.id) return s;
          return {
            ...s,
            courses: s.courses.map((c) => (c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c)),
          };
        })
      );
      setResourceLabel("");
      setToast({ type: "success", text: "Added file (session only)." });
    },
    [activeCourse, selectedSemester, resourceLabel]
  );

  const loadMajors = React.useCallback(() => {
    setMajors(mockMajors);
  }, []);

  return {
    semesters,
    setSemesters,
    selectedSemesterId,
    setSelectedSemesterId,
    toast,
    setToast,
    tab,
    setTab,
    addSubject,
    setAddSubject,
    addNumber,
    setAddNumber,
    addTitle,
    setAddTitle,
    addProfessor,
    setAddProfessor,
    newSemName,
    setNewSemName,
    drawerOpen,
    setDrawerOpen,
    drawerTab,
    setDrawerTab,
    activeCourseId,
    noteAuthor,
    setNoteAuthor,
    noteTopic,
    setNoteTopic,
    noteBody,
    setNoteBody,
    searchQuery,
    setSearchQuery,
    resourceLabel,
    setResourceLabel,
    resourceUrl,
    setResourceUrl,
    majorsLoading: false,
    majorsErr: null,
    selectedSemester,
    activeCourse,
    searchedNotes,
    majorsFiltered,
    majorFilter,
    setMajorFilter,
    selectedMajor,
    setSelectedMajor,
    openCourseDrawer,
    handleAddCourse,
    handleAddSemester,
    postNote,
    addResourceLink,
    addResourceFile,
    loadMajors,
  };
}
