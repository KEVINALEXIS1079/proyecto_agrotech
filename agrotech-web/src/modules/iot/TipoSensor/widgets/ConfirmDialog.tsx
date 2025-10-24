import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";

export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  loading = false,
}: {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  loading?: boolean;
}) {
  return (
    <Modal isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">{title}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-foreground-500">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={loading}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
