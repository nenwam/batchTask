import React from 'react'

const ModalComponent = () => {
    return (
        <div>
            <Modal
                contentSpacing
                description="Subtitle description text goes here"
                id="story-book-modal"
                onClose={function noRefCheck(){}}
                title="Modal title"
                triggerElement={null}
                >
                <ModalContent>
                    <p>
                        Modal content goes here
                    </p>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ModalComponent