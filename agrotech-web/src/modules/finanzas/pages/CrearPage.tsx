// src/modules/insumos/features/InsumosDemo.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Card, CardHeader, CardBody,
  Button, Select, SelectItem, Input, Divider,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Pagination, Textarea
} from "@heroui/react";
import {
  Plus, Eye, Pencil, Trash2, Settings, Search,
  Package, Image as ImageIcon
} from "lucide-react";

/* ===================== Tipos ===================== */
type EstadoInsumo =
  | "Activo" | "Inactivo" | "Obsoleto" | "Espera"
  | "Dañado" | "Reservado" | "Bajo stock" | "Medio stock";

type Proveedor = {
  id: string;
  nombre_proveedor: string;
  direccion_proveedor?: string;
  email_proveedor?: string;
  telefono_proveedor?: string;
};

type Almacen = { id: string; nombre_almacen: string };

type Categoria = {
  id: string;
  nombre_categoria: string;
  descripcion_categoria?: string;
};

type Insumo = {
  id_insumo_pk: string;
  nombre: string;
  tipo: string;
  unidad_medida: string;
  stock: number;
  costo: number;
  estado_insumo: EstadoInsumo;
  fecha_ingreso: string;
  fecha_salida?: string;
  fecha_vencimiento?: string;
  proveedorId?: string;
  almacenId?: string;
  categoriaId?: string;
  img_url?: string;
  descripcion?: string;
};

/* ===================== Mock ===================== */
const ESTADOS: EstadoInsumo[] = [
  "Activo","Inactivo","Obsoleto","Espera","Dañado","Reservado","Bajo stock","Medio stock"
];

const PROVEEDORES_MOCK: Proveedor[] = [
  { id: "p1", nombre_proveedor: "AgroProveedor SAS", email_proveedor: "ventas@agroprov.co", telefono_proveedor: "3001112233", direccion_proveedor: "Cra 10 # 20-30" },
  { id: "p2", nombre_proveedor: "Campo y Vida Ltda", email_proveedor: "info@campoyvida.com", direccion_proveedor: "Km 5 Vía Norte" },
  { id: "p3", nombre_proveedor: "FertiColombia" },
];

const ALMACENES_MOCK: Almacen[] = [
  { id: "a1", nombre_almacen: "Principal" },
  { id: "a2", nombre_almacen: "Bodega Norte" },
  { id: "a3", nombre_almacen: "Secundario" },
];

const CATEGORIAS_MOCK: Categoria[] = [
  { id: "c1", nombre_categoria: "Insecticida", descripcion_categoria: "Control de insectos" },
  { id: "c2", nombre_categoria: "Fertilizante", descripcion_categoria: "Aporte nutricional" },
  { id: "c3", nombre_categoria: "Herbicida", descripcion_categoria: "Control de malezas" },
];

function pad(n: number) { return n.toString().padStart(2, "0"); }
function datePlus(days = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeMockInsumos(n = 57): Insumo[] {
  const tipos = ["insecticida","fertilizante","herbicida","fungicida"];
  const unidades = ["500 gramos", "1 litro", "20 empaques", "5 kg", "250 ml"];
  const nombres = ["Weed Killer", "BioGrow", "Mata Gusanos", "Nitro Plus", "FungiStop", "MaxGreen"];
  const res: Insumo[] = [];
  for (let i=0;i<n;i++){
    res.push({
      id_insumo_pk: `i${i+1}`,
      nombre: `${rand(nombres)} ${i+1}`,
      tipo: rand(tipos),
      unidad_medida: rand(unidades),
      stock: Math.floor(Math.random() * 80) + 1,
      costo: Math.floor(Math.random() * 90000) + 10000,
      estado_insumo: rand(ESTADOS),
      fecha_ingreso: datePlus(-Math.floor(Math.random()*120)),
      fecha_vencimiento: Math.random()>0.4 ? datePlus(Math.floor(Math.random()*400)+30) : undefined,
      proveedorId: rand(PROVEEDORES_MOCK).id,
      almacenId: rand(ALMACENES_MOCK).id,
      categoriaId: rand(CATEGORIAS_MOCK).id,
      img_url: "",
      descripcion: "Lote demo",
    });
  }
  return res;
}

/* ===================== Componente ===================== */
export default function InsumosDemo() {
  // catálogos
  const [proveedores, setProveedores] = useState<Proveedor[]>(PROVEEDORES_MOCK);
  const [almacenes, setAlmacenes] = useState<Almacen[]>(ALMACENES_MOCK);
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_MOCK);

  // listado
  const [insumos, setInsumos] = useState<Insumo[]>(() => makeMockInsumos());

  // filtros
  const [q, setQ] = useState("");
  const [fProv, setFProv] = useState<string | null>(null);
  const [fAlm, setFAlm] = useState<string | null>(null);
  const [fCat, setFCat] = useState<string | null>(null);

  // paginación
  const PER_PAGE = 20;
  const [page, setPage] = useState(1);

  // modales
  const [openRegistrar, setOpenRegistrar] = useState(false);
  const [openIngresar, setOpenIngresar] = useState(false); // sumar stock
  const [openDetalle, setOpenDetalle] = useState<Insumo | null>(null);

  // form registrar/editar
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Insumo>>({
    nombre: "",
    tipo: "",
    unidad_medida: "",
    stock: 0,
    costo: 0,
    estado_insumo: "Activo",
    fecha_ingreso: datePlus(0),
  });

  // form ingresar stock
  const [ingSelId, setIngSelId] = useState<string | null>(null);
  const [ingCantidad, setIngCantidad] = useState<number>(0);
  const [ingSearch, setIngSearch] = useState("");

  // gestores catálogos (tuercas)
  const [openProvMgr, setOpenProvMgr] = useState(false);
  const [openAlmMgr, setOpenAlmMgr] = useState(false);
  const [openCatMgr, setOpenCatMgr] = useState(false);

  const resetForm = () => {
    setEditId(null);
    setForm({
      nombre: "",
      tipo: "",
      unidad_medida: "",
      stock: 0,
      costo: 0,
      estado_insumo: "Activo",
      fecha_ingreso: datePlus(0),
      fecha_salida: "",
      fecha_vencimiento: "",
      proveedorId: undefined,
      almacenId: undefined,
      categoriaId: undefined,
      descripcion: "",
      img_url: "",
    });
  };

  const filtered = useMemo(() => {
    let data = insumos.slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter(d =>
        `${d.nombre} ${d.tipo} ${d.unidad_medida}`.toLowerCase().includes(s)
      );
    }
    if (fProv) data = data.filter(d => d.proveedorId === fProv);
    if (fAlm)  data = data.filter(d => d.almacenId === fAlm);
    if (fCat)  data = data.filter(d => d.categoriaId === fCat);
    return data;
  }, [insumos, q, fProv, fAlm, fCat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  /* ===================== Helpers ===================== */
  const nombreProveedor = (id?: string) => proveedores.find(p => p.id === id)?.nombre_proveedor ?? "—";
  const nombreAlmacen   = (id?: string) => almacenes.find(a => a.id === id)?.nombre_almacen ?? "—";
  const nombreCategoria = (id?: string) => categorias.find(c => c.id === id)?.nombre_categoria ?? "—";

  /* ===================== CRUD Insumo (mock) ===================== */
  const onRegistrarSubmit = () => {
    if (!form.nombre || !form.tipo || !form.unidad_medida || !form.estado_insumo || !form.fecha_ingreso) return;

    if (editId) {
      setInsumos(prev => prev.map(i => i.id_insumo_pk === editId ? {
        ...i,
        ...form,
        stock: Number(form.stock ?? 0),
        costo: Number(form.costo ?? 0),
      } as Insumo : i));
    } else {
      const nuevo: Insumo = {
        id_insumo_pk: `i${Date.now()}`,
        nombre: form.nombre!,
        tipo: form.tipo!,
        unidad_medida: form.unidad_medida!,
        stock: Number(form.stock ?? 0),
        costo: Number(form.costo ?? 0),
        estado_insumo: (form.estado_insumo || "Activo") as EstadoInsumo,
        fecha_ingreso: form.fecha_ingreso!,
        fecha_salida: form.fecha_salida || undefined,
        fecha_vencimiento: form.fecha_vencimiento || undefined,
        proveedorId: form.proveedorId,
        almacenId: form.almacenId,
        categoriaId: form.categoriaId,
        descripcion: form.descripcion,
        img_url: form.img_url ?? "",
      };
      setInsumos(prev => [nuevo, ...prev]);
      setPage(1);
    }
    setOpenRegistrar(false);
    setEditId(null);
  };

  const onEdit = (i: Insumo) => {
    setEditId(i.id_insumo_pk);
    setForm({ ...i });
    setOpenRegistrar(true);
  };

  const onDelete = (id: string) => {
    setInsumos(prev => prev.filter(i => i.id_insumo_pk !== id));
    setOpenDetalle(null);
  };

  /* ===================== Ingresar stock (sumar) ===================== */
  const insumosFiltradosIngreso = useMemo(() => {
    const s = ingSearch.toLowerCase().trim();
    const base = s
      ? insumos.filter(i => `${i.nombre} ${i.tipo}`.toLowerCase().includes(s))
      : insumos;
    return base.slice(0, 100);
  }, [ingSearch, insumos]);

  const onIngresarSubmit = () => {
    if (!ingSelId || ingCantidad <= 0) return;
    setInsumos(prev =>
      prev.map(i => i.id_insumo_pk === ingSelId ? {
        ...i,
        stock: i.stock + ingCantidad,
        fecha_ingreso: datePlus(0),
      } : i)
    );
    setIngCantidad(0);
    setIngSelId(null);
    setOpenIngresar(false);
  };

  /* ===================== UI ===================== */
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <Card shadow="sm" className="border border-default-200">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Insumos</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="flat" startContent={<Plus className="w-4 h-4" />} onPress={() => { setOpenIngresar(true); }}>
              Ingresar stock
            </Button>
            <Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={() => { resetForm(); setOpenRegistrar(true); }}>
              Registrar insumo
            </Button>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="space-y-4">
          {/* Filtros con títulos + tuercas */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="col-span-2">
              <div className="text-xs text-foreground-500 mb-1">Buscador</div>
              <Input
                placeholder="Buscar por nombre, tipo o medida…"
                startContent={<Search className="w-4 h-4" />}
                value={q}
                onValueChange={(v) => { setQ(v); setPage(1); }}
              />
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-foreground-500 mb-1">Proveedor</div>
              <div className="flex gap-2">
                <Select
                  aria-label="Proveedor"
                  className="w-full"
                  selectedKeys={new Set(fProv ? [fProv] : [])}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0] as string | undefined;
                    setFProv(k ?? null); setPage(1);
                  }}
                >
                  {proveedores.map(p => (
                    <SelectItem key={p.id}>{p.nombre_proveedor}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenProvMgr(true)} title="Gestionar proveedores">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-foreground-500 mb-1">Almacén</div>
              <div className="flex gap-2">
                <Select
                  aria-label="Almacén"
                  className="w-full"
                  selectedKeys={new Set(fAlm ? [fAlm] : [])}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0] as string | undefined;
                    setFAlm(k ?? null); setPage(1);
                  }}
                >
                  {almacenes.map(a => (
                    <SelectItem key={a.id}>{a.nombre_almacen}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenAlmMgr(true)} title="Gestionar almacenes">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs text-foreground-500 mb-1">Categoría</div>
              <div className="flex gap-2">
                <Select
                  aria-label="Categoría"
                  className="w-full"
                  selectedKeys={new Set(fCat ? [fCat] : [])}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0] as string | undefined;
                    setFCat(k ?? null); setPage(1);
                  }}
                >
                  {categorias.map(c => (
                    <SelectItem key={c.id}>{c.nombre_categoria}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenCatMgr(true)} title="Gestionar categorías">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <Table aria-label="Tabla de insumos">
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Tipo</TableColumn>
              <TableColumn>Stock</TableColumn>
              <TableColumn>Medida</TableColumn>
              <TableColumn>Precio</TableColumn>
              <TableColumn>Vencimiento</TableColumn>
              <TableColumn>Ingreso</TableColumn>
              <TableColumn className="text-right">Acción</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin insumos">
              {pageItems.map(i => (
                <TableRow key={i.id_insumo_pk}>
                  <TableCell className="truncate">{i.nombre}</TableCell>
                  <TableCell className="capitalize">{i.tipo}</TableCell>
                  <TableCell>{i.stock}</TableCell>
                  <TableCell>{i.unidad_medida}</TableCell>
                  <TableCell>${i.costo.toLocaleString()}</TableCell>
                  <TableCell>{i.fecha_vencimiento ?? "—"}</TableCell>
                  <TableCell>{i.fecha_ingreso}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="flat" startContent={<Eye className="w-4 h-4" />} onPress={() => setOpenDetalle(i)}>
                        ver
                      </Button>
                      {/* editar/borrar se mantienen solo dentro de "ver detalles" */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          <div className="flex justify-end">
            <Pagination total={pages} page={page} onChange={setPage} />
          </div>
        </CardBody>
      </Card>

      {/* ===================== Modal: Registrar / Editar ===================== */}
      <Modal isOpen={openRegistrar} onOpenChange={setOpenRegistrar} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{editId ? "Modificar insumo" : "Registrar insumo"}</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Nombre" value={form.nombre ?? ""} onValueChange={(v)=>setForm(f=>({...f,nombre:v}))} />
              <Input label="Tipo" value={form.tipo ?? ""} onValueChange={(v)=>setForm(f=>({...f,tipo:v}))} />
              <Input label="Unidad/Medida" value={form.unidad_medida ?? ""} onValueChange={(v)=>setForm(f=>({...f,unidad_medida:v}))} />
              <Input label="Stock" type="number" min={0} value={String(form.stock ?? 0)} onValueChange={(v)=>setForm(f=>({...f,stock:Number(v||0)}))} />
              <Input label="Costo" type="number" min={0} value={String(form.costo ?? 0)} onValueChange={(v)=>setForm(f=>({...f,costo:Number(v||0)}))} />
              <Select
                label="Estado insumo"
                selectedKeys={new Set([form.estado_insumo ?? "Activo"])}
                onSelectionChange={(keys)=>{
                  const k = Array.from(keys)[0] as EstadoInsumo | undefined;
                  if (k) setForm(f=>({...f,estado_insumo:k}));
                }}
              >
                {ESTADOS.map(e => <SelectItem key={e}>{e}</SelectItem>)}
              </Select>

              <Input label="Fecha ingreso" type="date" value={form.fecha_ingreso ?? ""} onValueChange={(v)=>setForm(f=>({...f,fecha_ingreso:v}))} />
              <Input label="Fecha salida" type="date" value={form.fecha_salida ?? ""} onValueChange={(v)=>setForm(f=>({...f,fecha_salida:v}))} />
              <Input label="Fecha vencimiento" type="date" value={form.fecha_vencimiento ?? ""} onValueChange={(v)=>setForm(f=>({...f,fecha_vencimiento:v}))} />

              {/* Imagen */}
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-sm font-medium">Imagen</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>{
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setForm(f=>({...f,img_url:url}));
                      }
                    }}
                  />
                </div>
                <div className="w-full h-44 rounded-xl border border-default-200 grid place-items-center overflow-hidden">
                  {form.img_url ? (
                    <img src={form.img_url} alt="insumo" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center gap-2 text-foreground-400">
                      <ImageIcon className="w-5 h-5" /> sin imagen
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selects + tuerca al lado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex gap-2">
                <Select
                  label="Proveedor"
                  className="w-full"
                  selectedKeys={new Set(form.proveedorId ? [form.proveedorId] : [])}
                  onSelectionChange={(keys)=>{ const k = Array.from(keys)[0] as string|undefined; setForm(f=>({...f,proveedorId:k})) }}
                >
                  {proveedores.map(p => (
                    <SelectItem key={p.id}>{p.nombre_proveedor}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenProvMgr(true)} title="Gestionar proveedores">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Select
                  label="Almacén"
                  className="w-full"
                  selectedKeys={new Set(form.almacenId ? [form.almacenId] : [])}
                  onSelectionChange={(keys)=>{ const k = Array.from(keys)[0] as string|undefined; setForm(f=>({...f,almacenId:k})) }}
                >
                  {almacenes.map(a => (
                    <SelectItem key={a.id}>{a.nombre_almacen}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenAlmMgr(true)} title="Gestionar almacenes">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Select
                  label="Categoría"
                  className="w-full"
                  selectedKeys={new Set(form.categoriaId ? [form.categoriaId] : [])}
                  onSelectionChange={(keys)=>{ const k = Array.from(keys)[0] as string|undefined; setForm(f=>({...f,categoriaId:k})) }}
                >
                  {categorias.map(c => (
                    <SelectItem key={c.id}>{c.nombre_categoria}</SelectItem>
                  ))}
                </Select>
                <Button isIconOnly variant="flat" onPress={() => setOpenCatMgr(true)} title="Gestionar categorías">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Textarea
              label="Descripción"
              minRows={3}
              value={form.descripcion ?? ""}
              onValueChange={(v)=>setForm(f=>({...f,descripcion:v}))}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onPress={() => setOpenRegistrar(false)}>Cancelar</Button>
            <Button color="primary" onPress={onRegistrarSubmit}>
              {editId ? "Guardar cambios" : "Registrar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ===================== Modal: Ingresar stock (sumar) ===================== */}
      <Modal isOpen={openIngresar} onOpenChange={setOpenIngresar} size="xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Ingresar stock</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <div className="text-sm text-foreground-500 mb-1">Seleccionar insumo</div>
                <Select
                  aria-label="Seleccionar insumo"
                  selectedKeys={new Set(ingSelId ? [ingSelId] : [])}
                  onSelectionChange={(keys)=>{ const k = Array.from(keys)[0] as string|undefined; setIngSelId(k ?? null) }}
                  items={insumosFiltradosIngreso}
                  listboxProps={{
                    emptyContent: "Sin resultados",
                    topContent: (
                      <div className="px-2 py-2 sticky top-0 bg-content1 z-10 rounded-md border border-default-200">
                        <Input
                          size="sm"
                          placeholder="Buscar insumo…"
                          startContent={<Search className="w-4 h-4" />}
                          value={ingSearch}
                          onValueChange={setIngSearch}
                          classNames={{ inputWrapper: "h-9" }}
                        />
                      </div>
                    ),
                  }}
                  renderValue={(items)=> <>{items[0]?.textValue}</>}
                >
                  {(i: Insumo) => (
                    <SelectItem key={i.id_insumo_pk} textValue={`${i.nombre} | ${i.tipo}`}>
                      {i.nombre} — {i.tipo} ({i.unidad_medida})
                    </SelectItem>
                  )}
                </Select>
              </div>

              <div>
                <Input
                  label="Cantidad a ingresar"
                  type="number"
                  min={1}
                  value={String(ingCantidad)}
                  onValueChange={(v)=>setIngCantidad(Number(v||0))}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setOpenIngresar(false)}>Cancelar</Button>
            <Button color="primary" onPress={onIngresarSubmit}>Sumar al stock</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ===================== Modal: Detalle avanzado (con editar/borrar) ===================== */}
      <Modal isOpen={!!openDetalle} onOpenChange={() => setOpenDetalle(null)} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>Detalle del insumo</ModalHeader>
          <ModalBody className="space-y-4">
            {openDetalle && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input label="Nombre" readOnly value={openDetalle.nombre} />
                  <Input label="Tipo" readOnly value={openDetalle.tipo} />
                  <Input label="Estado" readOnly value={openDetalle.estado_insumo} />
                  <Input label="Stock" readOnly value={String(openDetalle.stock)} />
                  <Input label="Unidad/Medida" readOnly value={openDetalle.unidad_medida} />
                  <Input label="Costo" readOnly value={`$${openDetalle.costo.toLocaleString()}`} />
                  <Input label="Ingreso" readOnly value={openDetalle.fecha_ingreso} />
                  <Input label="Salida" readOnly value={openDetalle.fecha_salida ?? "—"} />
                  <Input label="Vencimiento" readOnly value={openDetalle.fecha_vencimiento ?? "—"} />
                  <Input label="Proveedor" readOnly value={nombreProveedor(openDetalle.proveedorId)} />
                  <Input label="Almacén" readOnly value={nombreAlmacen(openDetalle.almacenId)} />
                  <Input label="Categoría" readOnly value={nombreCategoria(openDetalle.categoriaId)} />
                </div>
                <Textarea label="Descripción" readOnly value={openDetalle.descripcion ?? ""} />
                <div className="w-full h-56 rounded-xl border border-default-200 grid place-items-center overflow-hidden">
                  {openDetalle.img_url ? (
                    <img src={openDetalle.img_url} alt="insumo" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center gap-2 text-foreground-400">
                      <ImageIcon className="w-5 h-5" /> sin imagen
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="flat" startContent={<Pencil className="w-4 h-4" />} onPress={() => onEdit(openDetalle)}>
                    editar
                  </Button>
                  <Button color="danger" variant="flat" startContent={<Trash2 className="w-4 h-4" />} onPress={() => onDelete(openDetalle.id_insumo_pk)}>
                    eliminar
                  </Button>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={() => setOpenDetalle(null)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ===================== Gestores de catálogos (tuercas) ===================== */}
      <ProveedoresManager
        isOpen={openProvMgr}
        onOpenChange={setOpenProvMgr}
        proveedores={proveedores}
        onCreate={(p)=> setProveedores(prev => [...prev, p])}
        onUpdate={(p)=> setProveedores(prev => prev.map(x => x.id === p.id ? p : x))}
        onDelete={(id)=> setProveedores(prev => prev.filter(x => x.id !== id))}
      />

      <AlmacenesManager
        isOpen={openAlmMgr}
        onOpenChange={setOpenAlmMgr}
        almacenes={almacenes}
        onCreate={(a)=> setAlmacenes(prev => [...prev, a])}
        onUpdate={(a)=> setAlmacenes(prev => prev.map(x => x.id === a.id ? a : x))}
        onDelete={(id)=> setAlmacenes(prev => prev.filter(x => x.id !== id))}
      />

      <CategoriasManager
        isOpen={openCatMgr}
        onOpenChange={setOpenCatMgr}
        categorias={categorias}
        onCreate={(c)=> setCategorias(prev => [...prev, c])}
        onUpdate={(c)=> setCategorias(prev => prev.map(x => x.id === c.id ? c : x))}
        onDelete={(id)=> setCategorias(prev => prev.filter(x => x.id !== id))}
      />
    </div>
  );
}

/* ===================== Proveedores Manager (con todos los campos) ===================== */
function ProveedoresManager({
  isOpen, onOpenChange, proveedores, onCreate, onUpdate, onDelete
}:{
  isOpen:boolean;
  onOpenChange:(v:boolean)=>void;
  proveedores: Proveedor[];
  onCreate:(p:Proveedor)=>void;
  onUpdate:(p:Proveedor)=>void;
  onDelete:(id:string)=>void;
}) {
  const [nuevo, setNuevo] = useState<Proveedor>({
    id: "", nombre_proveedor: "", direccion_proveedor: "", email_proveedor: "", telefono_proveedor: ""
  });
  const [edit, setEdit] = useState<Proveedor | null>(null);

  const clearNuevo = () => setNuevo({ id:"", nombre_proveedor:"", direccion_proveedor:"", email_proveedor:"", telefono_proveedor:"" });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Proveedores</ModalHeader>
        <ModalBody className="space-y-4">
          {/* Crear */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input placeholder="Nombre proveedor" value={nuevo.nombre_proveedor} onValueChange={(v)=>setNuevo(n=>({...n,nombre_proveedor:v}))}/>
            <Input placeholder="Dirección"          value={nuevo.direccion_proveedor || ""} onValueChange={(v)=>setNuevo(n=>({...n,direccion_proveedor:v}))}/>
            <Input placeholder="Email"              value={nuevo.email_proveedor || ""} onValueChange={(v)=>setNuevo(n=>({...n,email_proveedor:v}))}/>
            <div className="flex gap-2">
              <Input placeholder="Teléfono" className="w-full" value={nuevo.telefono_proveedor || ""} onValueChange={(v)=>setNuevo(n=>({...n,telefono_proveedor:v}))}/>
              <Button color="primary" startContent={<Plus className="w-4 h-4"/>}
                onPress={()=>{
                  if(!nuevo.nombre_proveedor.trim()) return;
                  const item: Proveedor = { ...nuevo, id:`p${Date.now()}` };
                  onCreate(item);
                  clearNuevo();
                }}>Agregar</Button>
            </div>
          </div>

          {/* Tabla */}
          <Table aria-label="Tabla de proveedores">
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Dirección</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Teléfono</TableColumn>
              <TableColumn className="text-right">Acción</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin proveedores">
              {proveedores.map((p)=>(
                <TableRow key={p.id}>
                  <TableCell>
                    {edit?.id===p.id ? (
                      <Input size="sm" value={edit.nombre_proveedor} onValueChange={(v)=>setEdit(e=>({...e!,nombre_proveedor:v}))}/>
                    ) : p.nombre_proveedor}
                  </TableCell>
                  <TableCell>
                    {edit?.id===p.id ? (
                      <Input size="sm" value={edit.direccion_proveedor || ""} onValueChange={(v)=>setEdit(e=>({...e!,direccion_proveedor:v}))}/>
                    ) : (p.direccion_proveedor || "—")}
                  </TableCell>
                  <TableCell>
                    {edit?.id===p.id ? (
                      <Input size="sm" value={edit.email_proveedor || ""} onValueChange={(v)=>setEdit(e=>({...e!,email_proveedor:v}))}/>
                    ) : (p.email_proveedor || "—")}
                  </TableCell>
                  <TableCell>
                    {edit?.id===p.id ? (
                      <Input size="sm" value={edit.telefono_proveedor || ""} onValueChange={(v)=>setEdit(e=>({...e!,telefono_proveedor:v}))}/>
                    ) : (p.telefono_proveedor || "—")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {edit?.id===p.id ? (
                        <>
                          <Button size="sm" variant="flat" onPress={() => { onUpdate(edit); setEdit(null); }}>guardar</Button>
                          <Button size="sm" variant="flat" onPress={() => setEdit(null)}>cancelar</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="flat" onPress={() => setEdit(p)}>editar</Button>
                          <Button size="sm" color="danger" variant="flat" onPress={() => onDelete(p.id)}>borrar</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => onOpenChange(false)}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ===================== Almacenes Manager ===================== */
function AlmacenesManager({
  isOpen, onOpenChange, almacenes, onCreate, onUpdate, onDelete
}:{
  isOpen:boolean;
  onOpenChange:(v:boolean)=>void;
  almacenes: Almacen[];
  onCreate:(a:Almacen)=>void;
  onUpdate:(a:Almacen)=>void;
  onDelete:(id:string)=>void;
}) {
  const [nuevo, setNuevo] = useState<string>("");
  const [edit, setEdit] = useState<Almacen | null>(null);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Almacenes</ModalHeader>
        <ModalBody className="space-y-4">
          {/* Crear */}
          <div className="flex gap-2">
            <Input placeholder="Nombre almacén" value={nuevo} onValueChange={setNuevo}/>
            <Button color="primary" startContent={<Plus className="w-4 h-4"/>}
              onPress={()=>{
                if(!nuevo.trim()) return;
                onCreate({ id:`a${Date.now()}`, nombre_almacen: nuevo.trim() });
                setNuevo("");
              }}>Agregar</Button>
          </div>

          {/* Tabla */}
          <Table aria-label="Tabla de almacenes">
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn className="text-right">Acción</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin almacenes">
              {almacenes.map((a)=>(
                <TableRow key={a.id}>
                  <TableCell>
                    {edit?.id===a.id ? (
                      <Input size="sm" value={edit.nombre_almacen} onValueChange={(v)=>setEdit(e=>({...e!,nombre_almacen:v}))}/>
                    ) : a.nombre_almacen}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {edit?.id===a.id ? (
                        <>
                          <Button size="sm" variant="flat" onPress={() => { onUpdate(edit); setEdit(null); }}>guardar</Button>
                          <Button size="sm" variant="flat" onPress={() => setEdit(null)}>cancelar</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="flat" onPress={() => setEdit(a)}>editar</Button>
                          <Button size="sm" color="danger" variant="flat" onPress={() => onDelete(a.id)}>borrar</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => onOpenChange(false)}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ===================== Categorías Manager (nombre + descripción) ===================== */
function CategoriasManager({
  isOpen, onOpenChange, categorias, onCreate, onUpdate, onDelete
}:{
  isOpen:boolean;
  onOpenChange:(v:boolean)=>void;
  categorias: Categoria[];
  onCreate:(c:Categoria)=>void;
  onUpdate:(c:Categoria)=>void;
  onDelete:(id:string)=>void;
}) {
  const [nuevo, setNuevo] = useState<{nombre:string; descripcion:string}>({nombre:"", descripcion:""});
  const [edit, setEdit] = useState<Categoria | null>(null);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Categorías</ModalHeader>
        <ModalBody className="space-y-4">
          {/* Crear */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input placeholder="Nombre categoría" value={nuevo.nombre} onValueChange={(v)=>setNuevo(s=>({...s,nombre:v}))}/>
            <Input placeholder="Descripción" value={nuevo.descripcion} onValueChange={(v)=>setNuevo(s=>({...s,descripcion:v}))}/>
            <div className="flex">
              <Button color="primary" className="ml-auto" startContent={<Plus className="w-4 h-4"/>}
                onPress={()=>{
                  if(!nuevo.nombre.trim()) return;
                  onCreate({
                    id:`c${Date.now()}`,
                    nombre_categoria: nuevo.nombre.trim(),
                    descripcion_categoria: nuevo.descripcion.trim() || undefined
                  });
                  setNuevo({nombre:"", descripcion:""});
                }}>
                Agregar
              </Button>
            </div>
          </div>

          {/* Tabla */}
          <Table aria-label="Tabla de categorías">
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Descripción</TableColumn>
              <TableColumn className="text-right">Acción</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Sin categorías">
              {categorias.map((c)=>(
                <TableRow key={c.id}>
                  <TableCell>
                    {edit?.id===c.id ? (
                      <Input size="sm" value={edit.nombre_categoria} onValueChange={(v)=>setEdit(e=>({...e!,nombre_categoria:v}))}/>
                    ) : c.nombre_categoria}
                  </TableCell>
                  <TableCell>
                    {edit?.id===c.id ? (
                      <Input size="sm" value={edit.descripcion_categoria || ""} onValueChange={(v)=>setEdit(e=>({...e!,descripcion_categoria:v}))}/>
                    ) : (c.descripcion_categoria || "—")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {edit?.id===c.id ? (
                        <>
                          <Button size="sm" variant="flat" onPress={() => { onUpdate(edit); setEdit(null); }}>guardar</Button>
                          <Button size="sm" variant="flat" onPress={() => setEdit(null)}>cancelar</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="flat" onPress={() => setEdit(c)}>editar</Button>
                          <Button size="sm" color="danger" variant="flat" onPress={() => onDelete(c.id)}>borrar</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => onOpenChange(false)}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}