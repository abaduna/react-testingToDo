import React, { useState } from 'react';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useFetch } from '../hooks/useFetch';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [dueDate, setDueDate] = useState('');

    const { data, error, loading, fetchData } = useFetch();

    const handleSubmit = (e) => {
        e.preventDefault();

        const todoData = {
            title,
            description,
            completed,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        };

        fetchData('http://localhost:8080/api/tasks', 'POST', todoData);

        // Optionally, update your tasks list if you want to display the new task immediately.
        // setTasks([...tasks, todoData]);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">To Do List</h1>
            
            <ListGroup className="mb-4">
                {tasks.map((t, index) => (
                    <ListGroup.Item key={index}>{t}</ListGroup.Item>
                ))}
            </ListGroup>

            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <h2>Create a new task</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="todoTitle" className="mb-3">
                                <Form.Label>Title</Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Enter the title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required

                                />
                            </Form.Group>

                            <Form.Group controlId="todoDescription" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter the description"
                                    rows={3}
                                    value={description}

                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="todoCompleted" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Completed"
                                    checked={completed}
                                    onChange={(e) => setCompleted(e.target.checked)}
                                />

                            </Form.Group>

                            <Form.Group controlId="todoDueDate" className="mb-3">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"

                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Create Task'}
                            </Button>
                        </Form>


                        {error && <p className="text-danger mt-3">Error: {error.message}</p>}
                        {data && <p className="text-success mt-3">Task created successfully!</p>}
                    </Col>
                </Row>

            </Container>
        </Container>
    );
}

export default Home;