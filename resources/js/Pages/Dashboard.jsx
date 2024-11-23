import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Dropdown from '@/Components/SpecialDropdown';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm, router } from '@inertiajs/react'

export default function Dashboard({ projects, priorities, tasks }) {
    const [confirmingTaskCreation, setConfirmingTaskCreation] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [newTaskName, setNewTaskName] = useState(null);
    const [fieldBeingUpdated, setFieldBeingUpdated] = useState(null);
    const [newTaskPriority, setNewTaskPriority] = useState(null);
    const [newTaskProject, setNewTaskProject] = useState(null);
    const [confirmingTaskUpdate, setConfirmingTaskUpdate] = useState(false);
    const [confirmingTaskDeletion, setConfirmingTaskDeletion] = useState(false);
    
    const createColumnDefs = (headerName, fields, includeDelete = false) => {
        let columns = fields.map(field => ({
            field: field.name,
            headerName: field.header,
            suppressSizeToFit: field.suppressSizeToFit || false,
            rowGroupIndex: field.rowGroupIndex || null,
            editable: field.editable,
            filter: field.filter,
            cellEditor: field.cellEditor,
            cellEditorParams: field.cellEditorParams,
        }));

        if (includeDelete) {
            columns.push({
                field: 'delete',
                cellRenderer: (params) => (
                    <div className="flex justify-center items-center h-full w-full">
                        <button
                            onClick={() => {
                                setTaskId(params.data.id);
                                setConfirmingTaskDeletion(true);
                            }}
                            className="flex items-center justify-center text-red-500 transform hover:scale-150 transition ease-in-out duration-150"
                            aria-label="Delete"
                            type="button"
                        >
                            <svg className="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                ),
                suppressSizeToFit: true,
                editable: false,
                filter: false,
            });
        }

        return [{
            headerName: headerName,
            children: columns
        }];
    };

    const projectsFields = [
        { name: "id", header: "ID", suppressSizeToFit: true, rowGroupIndex: 0, editable: false, filter: false },
        {
            name: "name",
            header: "Name",
            editable: true,
            cellEditor: 'agTextCellEditor',
            valueParser: (params) => params.newValue,
        },
        {
            name: "created",
            header: "Created",
            editable: false
        },
        {
            name: "updated",
            header: "Updated",
            editable: false
        },
    ];

    const prioritiesFields = [
        { name: "id", header: "ID", suppressSizeToFit: true, rowGroupIndex: 0, editable: false, filter: false },
        {
            name: "name",
            header: "Name",
            editable: true,
            cellEditor: 'agTextCellEditor',
            valueParser: (params) => params.newValue,
        },
        {
            name: "created",
            header: "Created",
            editable: false
        },
        {
            name: "updated",
            header: "Updated",
            editable: false
        },
    ];

    const tasksFields = [
        {
            name: "id",
            header: "ID",
            suppressSizeToFit: true,
            rowGroupIndex: 0,
            editable: false,
            filter: false
        },
        {
            name: "task_name",
            header: "Name",
            cellEditor: 'agTextCellEditor',
            valueParser: (params) => params.newValue,
        },
        {
            name: "priority",
            header: "Priority",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: priorities.map((priority) => priority.name),
            }
        },
        {
            name: "project",
            header: "Project",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: projects.map((project) => project.name),
            }
        },
        {
            name: "created",
            header: "Created",
            editable: false
        },
        {
            name: "updated",
            header: "Updated",
            editable: false
        },
    ];

    const projectDefs = createColumnDefs("Projects", projectsFields, false);
    const priorityDefs = createColumnDefs("Priorities", prioritiesFields, false);
    const taskDefs = createColumnDefs("Tasks", tasksFields, true);

    const projectData = projects.map(project => ({
        id: project.id,
        name: project.name,
        created: new Date(project.created_at).toLocaleString(),
        updated: new Date(project.updated_at).toLocaleString(),
    }));

    const priorityData = priorities.map(priority => ({
        id: priority.id,
        name: priority.name,
        created: new Date(priority.created_at).toLocaleString(),
        updated: new Date(priority.updated_at).toLocaleString(),
    }));

    const taskData = tasks.map(task => ({
        id: task.id,
        task_name: task.name,
        priority: task.priority.name,
        project: task.project ? task.project.name : 'No Project',
        created: new Date(task.created_at).toLocaleString(),
        updated: new Date(task.updated_at).toLocaleString(),
    }));

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
        priority: '',
        project: ''
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('task.create'), {
            onSuccess: () => {
                reset();
                setConfirmingTaskCreation(false);
            },
        });
    };

    const openModal = () => {
        setConfirmingTaskCreation(true);
        reset();
    };

    const closeModal = () => {
        setConfirmingTaskCreation(false);
        setConfirmingTaskUpdate(false);
        setConfirmingTaskDeletion(false);
        reset();
    };

    const updateTaskData = (url, method = 'patch', data = {}, options = {}) => {
        router[method](url, data, options);
    };

    const cellValueChanged = (e) => {
        const { field } = e.colDef;
        const taskId = e.data.id;

        if (field === 'task_name') {
            const newTaskName = e.newValue;

            if (newTaskName !== e.oldValue) {
                setTaskId(taskId);
                setNewTaskName(newTaskName);
                setFieldBeingUpdated('task_name');
                setConfirmingTaskUpdate(true);
            }
        } else if (field === 'priority') {
            const newPriority = e.newValue;

            if (newPriority !== e.oldValue) {
                setTaskId(taskId);
                setNewTaskPriority(newPriority);
                setFieldBeingUpdated('priority');
                setConfirmingTaskUpdate(true);
            }
        } else if (field === 'project') {
            const newProject = e.newValue;

            if (newProject !== e.oldValue) {
                setTaskId(taskId);
                setNewTaskProject(newProject);
                setFieldBeingUpdated('project');
                setConfirmingTaskUpdate(true);
            }
        }
    };

    const updateTask = () => {
        if (!taskId) return;

        const updates = {};

        if (fieldBeingUpdated === 'task_name') {
            updates.name = newTaskName;
        }
        if (fieldBeingUpdated === 'priority') {
            updates.priority = newTaskPriority;
        }
        if (fieldBeingUpdated === 'project') {
            updates.project = newTaskProject
        }

        updateTaskData(`/tasks/${taskId}`, 'patch', updates, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingTaskUpdate(false);
            },
            onError: (error) => {
                console.error('Error updating task:', error);
            }
        });
    };

    const deleteTask = (taskId) => {
        destroy(route('task.destroy', taskId), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingTaskDeletion(false);
            },
            onError: (error) => {
                console.error('Error deleting task:', error);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="h-full flex flex-col space-y-2">
                <div className="flex-grow flex flex-col space-y-2">
                    <div className="flex justify-start">
                        <PrimaryButton className="w-fit" onClick={openModal}>
                            Create Task
                        </PrimaryButton>
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <DataTable
                            rowData={taskData}
                            columnDefs={taskDefs}
                            onCellValueChanged={cellValueChanged}
                        />
                    </div>
                </div>

                <div className="flex flex-grow space-x-2 overflow-hidden">
                    <div className="flex-grow overflow-hidden">
                        <DataTable rowData={projectData} columnDefs={projectDefs} />
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <DataTable rowData={priorityData} columnDefs={priorityDefs} />
                    </div>
                </div>

                <Modal show={confirmingTaskCreation} onClose={closeModal}>
                    <form className="p-6" onSubmit={submit}>
                        <div className="space-y-3">
                            <div className="flex flex-col space-y-3">
                                <div className="flex space-x-2">
                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name"
                                        />

                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            placeholder="Update my calendar"
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="flex w-full"
                                            required
                                        />

                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="priority"
                                            value="Priority"
                                        />

                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out focus:outline-none"
                                                    >
                                                        {selectedPriority ? selectedPriority : 'Assign Priority'}

                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                {priorities.map((priority) => (
                                                    <Dropdown.Items key={priority.id} onClick={() => {
                                                        setSelectedPriority(priority.name);
                                                        setData('priority', priority.id);
                                                    }}>
                                                        {priority.name}
                                                    </Dropdown.Items>
                                                ))}
                                            </Dropdown.Content>
                                        </Dropdown>

                                        <InputError
                                            message={errors.priority}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="project"
                                            value="Project"
                                        />

                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out focus:outline-none"
                                                    >
                                                        {selectedProject ? selectedProject : 'Assign Project'}

                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                {projects.map((project) => (
                                                    <Dropdown.Items key={project.id} onClick={() => {
                                                        setSelectedProject(project.name);
                                                        setData('project', project.id);
                                                    }}>
                                                        {project.name}
                                                    </Dropdown.Items>
                                                ))}
                                            </Dropdown.Content>
                                        </Dropdown>

                                        <InputError
                                            message={errors.project}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <PrimaryButton className='w-full justify-center' disabled={processing}>
                                Create
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>

                <Modal show={confirmingTaskUpdate} onClose={closeModal}>
                    <div className="flex flex-col items-center p-6 space-y-3">
                        {fieldBeingUpdated === 'task_name' && (
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to update the task name to "{newTaskName}"?
                            </h2>
                        )}
                        {fieldBeingUpdated === 'priority' && (
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to update the task priority to "{newTaskPriority}"?
                            </h2>
                        )}
                        {fieldBeingUpdated === 'project' && (
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to update the task project to "{newTaskProject}"?
                            </h2>
                        )}
                        <div className="flex space-x-3">
                            <DangerButton className='w-fit justify-center' onClick={updateTask} disabled={processing}>
                                Yes
                            </DangerButton>
                            <SecondaryButton className='w-fit justify-center' onClick={() => setConfirmingTaskUpdate(false)} disabled={processing}>
                                No
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>

                <Modal show={confirmingTaskDeletion} onClose={closeModal}>
                    <div className="flex flex-col items-center p-6 space-y-3">
                        <h2 className="text-lg font-medium text-gray-900">
                            Are you sure you want to delete this task?
                        </h2>
                        <div className="flex space-x-3">
                            <DangerButton
                                className="w-fit justify-center"
                                onClick={() => deleteTask(taskId)}
                                disabled={processing}
                            >
                                Yes
                            </DangerButton>
                            <SecondaryButton
                                className="w-fit justify-center"
                                onClick={() => setConfirmingTaskDeletion(false)}
                                disabled={processing}
                            >
                                No
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
