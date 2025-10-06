import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getAuthProfile, getUserById, updateUser} from "../api/profile.service";
import type { UpdateUserInput, User } from "../model/types";
import {mapUserDTO} from "../model/mappers";

export function usePerfil() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const auth = await getAuthProfile();
        userId.current = auth.id;
        const dto = await getUserById(auth.id);
        if (!alive) return;
        setMe(mapUserDTO(dto));
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const save = useCallback(async (input: UpdateUserInput) => {
    if (userId.current == null) return;
    setSaving(true);
    setError(null);
    try {
      const dto = await updateUser(userId.current, input);
      setMe(mapUserDTO(dto));
    } catch (e: any) {
      setError(e?.message ?? "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const state = useMemo(() => ({ me, loading, saving, error }), [me, loading, saving, error]);
  return { ...state, save, userId: userId.current };
}
