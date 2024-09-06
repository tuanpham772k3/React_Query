import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
interface IUser {
    name: string,
    email: string
}
const UserCreateModal = (props: any) => {
    const { isOpenCreateModal, setIsOpenCreateModal } = props;
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: IUser) => {
            const response = await fetch(`http://localhost:8000/users`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // Send the payload directly
            });
            // Check if the response is not OK and throw an error
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return response.json(); // Parse response JSON
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['repoData'], })
            setIsOpenCreateModal(false)
            setEmail("")
            setName("")
        },

    });

    const handleSubmit = () => {
        if (!email) {
            alert("email empty");
            return;
        }
        if (!name) {
            alert("name empty");
            return;
        }
        //call api => call redux
        console.log({ email, name }) //payload
        mutation.mutate({ email, name })   // Hàm mutate được gọi để thực hiện mutation
    }

    return (
        <>
            <Modal
                show={isOpenCreateModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={false}
                onHide={() => setIsOpenCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add A New User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel
                        label="Email"
                        className="mb-3"
                    >
                        <Form.Control
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Name">
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='warning'
                        onClick={() => setIsOpenCreateModal(false)} className='mr-2'>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserCreateModal;