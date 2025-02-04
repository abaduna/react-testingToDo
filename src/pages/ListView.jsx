import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFetch } from '../hooks/useFetch';

const ListView = () => {
    const { data, error, loading } = useFetch('http://localhost:8080/api/tasks', 'GET');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const { fetchData: updateTask } = useFetch();
    const { fetchData: deleteTask } = useFetch();
    const { fetchData: markAsDone } = useFetch();
    console.log(data);
    console.log(error);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            await updateTask(
                `http://localhost:8080/api/tasks/${editingTask.id}`,
                'PUT',
                editingTask
            );
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (task) => {
        try {
            await deleteTask(
                `http://localhost:8080/api/tasks/${task.id}`,
                'DELETE'
            );
            window.location.reload();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    const handleMarkAsDone = async (task) => {
        try {
            await markAsDone(
                `http://localhost:8080/api/tasks/${task.id}/complete`,
                'PATCH',
                { completed: true }
            );
            window.location.reload();
        } catch (error) {
            console.error('Error marking task as done:', error);
        }
    };
    return (
        <div>
            <h1>Lists</h1>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((list) => (
                            <tr key={list.id} className={!list.completed ? 'table-danger' : ''}>
                                <td><strong>{list.title}</strong></td>
                                <td>{list.description}</td>
                                <td>
                                    <Button 
                                        variant="primary"
                                        onClick={() => handleEdit(list)}
                                    >
                                        Edit

                                    </Button>
                                    <Button 
                                        variant="danger"
                                        onClick={() => handleDelete(list)}
                                    >

                                        Delete
                                    </Button>
                                    <Button variant="info" onClick={() => handleMarkAsDone(list)}>Mark as Done</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No tasks available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingTask?.title || ''}
                                onChange={(e) => setEditingTask({
                                    ...editingTask,
                                    title: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editingTask?.description || ''}
                                onChange={(e) => setEditingTask({
                                    ...editingTask,
                                    description: e.target.value
                                })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Completed"
                                checked={editingTask?.completed || false}
                                onChange={(e) => setEditingTask({
                                    ...editingTask,
                                    completed: e.target.checked
                                })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setEditingTask({
                                    ...editingTask,
                                    dueDate: e.target.value
                                })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ListView;
