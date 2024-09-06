import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const UserDeleteModal = (props: any) => {
    const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://localhost:8000/users/${dataUser.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Send the payload directly
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
            setIsOpenDeleteModal(false)
        },

    });

    const handleSubmit = () => {
        console.log({ id: dataUser?.id });
        mutation.mutate()   // Hàm mutate được gọi để thực hiện mutation

    }

    return (
        <Modal
            show={isOpenDeleteModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop={false}
            onHide={() => setIsOpenDeleteModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete A User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Delete the user: {dataUser?.email ?? ""}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='warning'
                    onClick={() => setIsOpenDeleteModal(false)} className='mr-2'>Cancel</Button>
                <Button onClick={() => handleSubmit()}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserDeleteModal;