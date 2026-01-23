import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthLayout from "../widgets/AuthLayout";
import ToastDialog from "../widgets/ToastDialog";
import AuthBackButton from "../ui/AuthBackButton";
import AuthLogo from "../ui/AuthLogo";
import AuthRecoverForm, { type AuthRecoverValues } from "../ui/AuthRecoverForm";
import { useRecoverRequest } from "../hooks/useRecover";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/motion"; // si no usas alias "@", usa la ruta relativa

export default function RecoverPage() {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useRecoverRequest();
  const navigate = useNavigate();

  async function handleSubmit(v: AuthRecoverValues) {
    if (!v.email) {
      setMsg("El correo es obligatorio");
      setOpen(true);
      return;
    }
    try {
      await mutateAsync({ email: v.email });
      navigate("/code", { state: { email: v.email } });
    } catch (e: any) {
      setMsg(e?.message || "No se pudo enviar el código");
      setOpen(true);
    }
  }

  // cierre auto opcional del toast
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setOpen(false), 3500);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.25 } }}>
        <AuthLayout
          title={
            <motion.span variants={fadeInUp} initial="initial" animate="animate">
              Recuperar tu acceso
            </motion.span>
          }
          subtitle={
            <motion.span variants={fadeInUp} initial="initial" animate="animate">
              Escribe tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </motion.span>
          }
          logoSlot={
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <AuthLogo />
            </motion.div>
          }
          backSlot={
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <AuthBackButton />
            </motion.div>
          }
          formTitle={
            <motion.span variants={fadeInUp} initial="initial" animate="animate">
              Verificación
            </motion.span>
          }
        >
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeInUp}>
              <AuthRecoverForm onSubmit={handleSubmit} loading={isPending} />
            </motion.div>
          </motion.div>
        </AuthLayout>
      </motion.div>

      {/* Toast animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
            className="fixed inset-0 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <ToastDialog
                open
                title="Recuperación"
                message={msg}
                onClose={() => setOpen(false)}
                variant="warning"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
