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
import { departmentService } from "@/services/departmentService";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";

const DepartmentManagement = () => {
    const { toast } = useToast();
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // Form State
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response || []); 
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load departments.",
                variant: "destructive",
            });
            setDepartments([]); // Ensure it's an array
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const resetForm = () => {
        setName("");
        setSelectedDepartment(null);
        setIsEditMode(false);
    };

    const handleAddDepartment = () => {
        resetForm();
        setOpen(true);
    };

    const handleEditDepartment = (department) => {
        resetForm();
        setIsEditMode(true);
        setSelectedDepartment(department);
        setName(department.name || "");
        setOpen(true);
    };

    const handleDeleteDepartment = async (departmentId) => {
        if (!window.confirm("Are you sure you want to delete this department? This might affect related student records.")) {
            return;
        }
        setLoading(true);
        try {
            await departmentService.deleteDepartment(departmentId);
            await fetchDepartments(); // Refresh list
            toast({
                title: "Success",
                description: "Department deleted successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete department.",
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    const handleSaveDepartment = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const departmentData = { name };

            if (isEditMode && selectedDepartment) {
                await departmentService.updateDepartment(selectedDepartment.id, departmentData);
                toast({
                    title: "Success",
                    description: "Department updated successfully.",
                });
            } else {
                await departmentService.createDepartment(departmentData);
                toast({
                    title: "Success",
                    description: "Department created successfully.",
                });
            }
            setOpen(false);
            resetForm();
            await fetchDepartments(); // Refresh list
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to save department.";
            toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive",
            });
        } finally {
            setFormLoading(false);
        }
    };

    return (
        // No Layout component here
        <Card>
            <CardHeader>
                <CardTitle>Department Management</CardTitle>
                <CardDescription>Add, edit, or delete academic departments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex justify-end">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddDepartment}>
                                <Plus className="h-4 w-4 mr-2" /> Add Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleSaveDepartment}>
                                <DialogHeader>
                                    <DialogTitle>{isEditMode ? "Edit Department" : "Add Department"}</DialogTitle>
                                    <DialogDescription>
                                        {isEditMode ? "Make changes to the department name." : "Add a new department to the system."}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={formLoading}>
                                        {formLoading ? "Saving..." : "Save changes"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-24 inline-block" /></TableCell>
                                    </TableRow>
                                ))
                            ) : departments.length > 0 ? (
                                departments.map(department => (
                                    <TableRow key={department.id}>
                                        <TableCell>{department.name}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditDepartment(department)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDepartment(department.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">No departments found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default DepartmentManagement;