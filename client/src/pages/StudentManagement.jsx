import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { studentService } from "@/services/studentService";
import { departmentService } from "@/services/departmentService";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from 'lucide-react';
import { X } from 'lucide-react'; // Import X icon for clear button
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const StudentManagement = () => {
    const { toast } = useToast();
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [semesters] = useState([
        { id: '1', name: 'Semester 1' },
        { id: '2', name: 'Semester 2' },
        { id: '3', name: 'Semester 3' },
        { id: '4', name: 'Semester 4' }
    ]);

    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [fullName, setFullName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState(""); // New state for email
    const [departmentId, setDepartmentId] = useState("");
    const [semesterId, setSemesterId] = useState("");

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState(""); // State for immediate input value

    const fetchStudents = useCallback(async () => {
        console.log("Attempting to fetch students...");
        setLoading(true);
        try {
            const response = await studentService.getAllStudents();
            console.log("Raw students response:", response);
            const studentsData = response?.data;
            console.log("Extracted students data:", studentsData);
            if (Array.isArray(studentsData)) {
                setStudents(studentsData);
                console.log("Students state updated.");
            } else {
                console.error("Fetched students data is not an array:", studentsData);
                setStudents([]);
                toast({
                    title: "Warning",
                    description: "Received unexpected format for students.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("ERROR fetching students:", error.response?.data || error.message || error);
            toast({
                title: "Error",
                description: "Failed to load students. Check console.",
                variant: "destructive",
            });
            setStudents([]);
        } finally {
            setLoading(false);
            console.log("Finished fetching students.");
        }
    }, [toast]);

    const fetchDepartments = useCallback(async () => {
        console.log("Attempting to fetch departments...");
        try {
            const response = await departmentService.getAllDepartments();
            console.log("Raw departments response:", response);
            const departmentsData = response; 
            console.log("Extracted departments data:", departmentsData);
            if (Array.isArray(departmentsData)) {
                setDepartments(departmentsData);
                console.log("Departments state updated.");
            } else {
                console.error("Fetched departments data is not an array:", departmentsData);
                setDepartments([]);
                toast({
                    title: "Warning",
                    description: "Received unexpected format for departments.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("ERROR fetching departments:", error.response?.data || error.message || error);
            toast({
                title: "Error",
                description: "Failed to load departments. Check console.",
                variant: "destructive",
            });
            setDepartments([]);
        }
    }, [toast]);

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
    }, [fetchStudents, fetchDepartments]);

    // Handle the search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    // Filter students based on search input
    const filteredStudents = students.filter(student => {
        return (
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) || // Include email in search
            student.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const resetForm = () => {
        setFullName("");
        setStudentId("");
        setEmail(""); // Reset email field
        setDepartmentId("");
        setSemesterId("");
        setSelectedStudent(null);
        setIsEditMode(false);
    };

    const handleAddStudent = () => {
        resetForm();
        setOpen(true);
    };

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setFullName(student.fullName);
        setStudentId(student.studentId);
        setEmail(student.email || ""); // Set email from student data
        setDepartmentId(student.department?.id.toString());
        setSemesterId(student.semester?.id.toString());
        setIsEditMode(true);
        setOpen(true);
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    const handleDeleteStudent = async (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await studentService.deleteStudent(idToDelete);
                toast({
                    title: "Success",
                    description: "Student deleted successfully.",
                });
                // Update the students list by removing the deleted student
                setStudents(prev => prev.filter(student => student.id !== idToDelete));
            } catch (error) {
                console.error("Error deleting student:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete student. " + (error.response?.data?.message || error.message),
                    variant: "destructive",
                });
            }
        }
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        if (!fullName || !studentId || !email || !departmentId || !semesterId) {
            toast({
                title: "Validation Error",
                description: "All fields are required.",
                variant: "destructive",
            });
            return;
        }

        setFormLoading(true);

        try {
            const studentData = {
                fullName,
                studentId,
                email, // Include email in the data
                department: {
                    id: departmentId
                },
                semester: {
                    id: semesterId
                }
            };

            if (isEditMode) {
                await studentService.updateStudent(selectedStudent.id, studentData);
                toast({
                    title: "Success",
                    description: "Student updated successfully.",
                });
                // Update the student in the list
                setStudents(prev => prev.map(student => 
                    student.id === selectedStudent.id 
                        ? { ...student, ...studentData } 
                        : student
                ));
            } else {
                const newStudent = await studentService.createStudent(studentData);
                toast({
                    title: "Success",
                    description: "Student added successfully.",
                });
                // Add the new student to the list
                setStudents(prev => [...prev, newStudent]);
            }

            // Close the dialog and reset the form
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving student:", error);
            toast({
                title: "Error",
                description: "Failed to save student. " + (error.response?.data?.message || error.message),
                variant: "destructive",
            });
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Student Management</CardTitle>
                        <CardDescription>Manage students in your school</CardDescription>
                    </div>
                    <Dialog open={open} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddStudent}>
                                <Plus className="mr-2 h-4 w-4" /> Add Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {isEditMode ? "Edit Student" : "Add New Student"}
                                </DialogTitle>
                                <DialogDescription>
                                    {isEditMode 
                                        ? "Update student information in the system."
                                        : "Add a new student to the school management system."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveStudent}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="fullName" className="text-right">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="studentId" className="text-right">
                                            Student ID
                                        </Label>
                                        <Input
                                            id="studentId"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="department" className="text-right">
                                            Department
                                        </Label>
                                        <Select
                                            value={departmentId}
                                            onValueChange={setDepartmentId}
                                            required
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {departments.map((dept) => (
                                                    <SelectItem 
                                                        key={dept.id} 
                                                        value={dept.id.toString()}
                                                        className="cursor-pointer"
                                                    >
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="semester" className="text-right">
                                            Semester
                                        </Label>
                                        <Select 
                                            value={semesterId} 
                                            onValueChange={setSemesterId}
                                            required
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a semester" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {semesters.map((semester) => (
                                                    <SelectItem 
                                                        key={semester.id} 
                                                        value={semester.id}
                                                        className="cursor-pointer"
                                                    >
                                                        {semester.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={formLoading}>
                                        {formLoading ? (
                                            "Saving..."
                                        ) : isEditMode ? (
                                            "Update Student"
                                        ) : (
                                            "Add Student"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            placeholder="Search students..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="max-w-sm"
                        />
                        {inputValue && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                    setInputValue(''); // Clear input value
                                    setSearchTerm(''); // Clear search term immediately
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={`skel-${index}`}>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-24 inline-block" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.fullName}</TableCell>
                                        <TableCell>{student.studentId}</TableCell>
                                        <TableCell>{student.email || 'N/A'}</TableCell>
                                        <TableCell>{student.department?.name || 'N/A'}</TableCell>
                                        <TableCell>{student.semester?.name || 'N/A'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditStudent(student)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        {searchTerm ? "No students match your search." : "No students found."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default StudentManagement;