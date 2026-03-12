"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

type Overview = { system?: string; topUniversities?: string[]; calendar?: string };
type Costs = { tuition?: string; living?: string; scholarships?: string };
type Requirements = { visa?: string; language?: string; documents?: string };
type Living = { accommodation?: string; lifestyle?: string; testimonial?: string };

type StudyRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  overview: Overview;
  costs: Costs;
  requirements: Requirements;
  living: Living;
  sort_order: number;
  created_at?: string;
};

const defaultOverview: Overview = { system: "", topUniversities: [], calendar: "" };
const defaultCosts: Costs = { tuition: "", living: "", scholarships: "" };
const defaultRequirements: Requirements = { visa: "", language: "", documents: "" };
const defaultLiving: Living = { accommodation: "", lifestyle: "", testimonial: "" };

export default function AdminStudiesPage() {
  const [studies, setStudies] = useState<StudyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [overview, setOverview] = useState<Overview>(defaultOverview);
  const [costs, setCosts] = useState<Costs>(defaultCosts);
  const [requirements, setRequirements] = useState<Requirements>(defaultRequirements);
  const [living, setLiving] = useState<Living>(defaultLiving);
  const [sortOrder, setSortOrder] = useState(0);

  const loadStudies = () => {
    setLoading(true);
    fetch("/api/admin/studies")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStudies(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudies();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setSlug("");
    setName("");
    setDescription("");
    setImage("");
    setOverview(defaultOverview);
    setCosts(defaultCosts);
    setRequirements(defaultRequirements);
    setLiving(defaultLiving);
    setSortOrder(studies.length);
    setDialogOpen(true);
  };

  const openEdit = (row: StudyRow) => {
    setEditingId(row.id);
    setSlug(row.slug);
    setName(row.name);
    setDescription(row.description);
    setImage(row.image);
    setOverview({
      system: row.overview?.system ?? "",
      topUniversities: Array.isArray(row.overview?.topUniversities) ? row.overview.topUniversities : [],
      calendar: row.overview?.calendar ?? "",
    });
    setCosts({
      tuition: row.costs?.tuition ?? "",
      living: row.costs?.living ?? "",
      scholarships: row.costs?.scholarships ?? "",
    });
    setRequirements({
      visa: row.requirements?.visa ?? "",
      language: row.requirements?.language ?? "",
      documents: row.requirements?.documents ?? "",
    });
    setLiving({
      accommodation: row.living?.accommodation ?? "",
      lifestyle: row.living?.lifestyle ?? "",
      testimonial: row.living?.testimonial ?? "",
    });
    setSortOrder(row.sort_order ?? 0);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const slugTrim = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slugTrim || !name.trim()) {
      toast.error("Slug and name are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: slugTrim,
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        overview: {
          system: overview.system ?? "",
          topUniversities: overview.topUniversities ?? [],
          calendar: overview.calendar ?? "",
        },
        costs: {
          tuition: costs.tuition ?? "",
          living: costs.living ?? "",
          scholarships: costs.scholarships ?? "",
        },
        requirements: {
          visa: requirements.visa ?? "",
          language: requirements.language ?? "",
          documents: requirements.documents ?? "",
        },
        living: {
          accommodation: living.accommodation ?? "",
          lifestyle: living.lifestyle ?? "",
          testimonial: living.testimonial ?? "",
        },
        sort_order: sortOrder,
      };
      if (editingId) {
        const res = await fetch(`/api/admin/studies/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message || "Failed to update study.");
          return;
        }
        toast.success("Study updated.");
      } else {
        const res = await fetch("/api/admin/studies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message || "Failed to create study.");
          return;
        }
        toast.success("Study created.");
      }
      setDialogOpen(false);
      loadStudies();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/studies/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Failed to delete.");
        return;
      }
      toast.success("Study deleted.");
      setDeleteId(null);
      loadStudies();
    } finally {
      setDeleting(false);
    }
  };

  const topUniText = (overview.topUniversities ?? []).join("\n");
  const setTopUniText = (text: string) =>
    setOverview((o) => ({ ...o, topUniversities: text.split("\n").filter(Boolean) }));

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/admin/studies/upload-image", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Image upload failed.");
        return;
      }
      if (data.url) setImage(data.url);
      toast.success("Image uploaded.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Studies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage study destinations shown on the site and etudes page.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add study
        </Button>
      </div>
      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No studies yet. Add one to show destinations on the home and etudes pages.
                  </TableCell>
                </TableRow>
              ) : (
                studies.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.image ? (
                        <img src={row.image} alt="" className="h-10 w-14 rounded object-cover" />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="font-mono text-xs">{row.slug}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{row.description || "—"}</TableCell>
                    <TableCell>{row.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(row)} className="gap-1">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteId(row.id)} className="gap-1 text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit study" : "Add study"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Slug (URL id, e.g. portugal)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="portugal"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Portugal"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sort_order">Sort order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Short description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Affordable EU education"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Image</Label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="mt-1 flex items-center gap-4">
                {image ? (
                  <div className="relative">
                    <img src={image} alt="Study" className="h-24 w-32 rounded border border-border object-cover" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 left-0 right-0 mx-auto w-fit"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={imageUploading}
                    >
                      {imageUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Replace
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={imageUploading}
                    className="gap-2"
                  >
                    {imageUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    Upload image
                  </Button>
                )}
              </div>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="living">Living</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-3 pt-3">
                <div>
                  <Label>Educational system</Label>
                  <Textarea
                    value={overview.system ?? ""}
                    onChange={(e) => setOverview((o) => ({ ...o, system: e.target.value }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Top universities (one per line)</Label>
                  <Textarea
                    value={topUniText}
                    onChange={(e) => setTopUniText(e.target.value)}
                    rows={3}
                    placeholder="University of Lisbon\nUniversity of Porto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Academic calendar</Label>
                  <Input
                    value={overview.calendar ?? ""}
                    onChange={(e) => setOverview((o) => ({ ...o, calendar: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              <TabsContent value="costs" className="space-y-3 pt-3">
                <div>
                  <Label>Tuition</Label>
                  <Input
                    value={costs.tuition ?? ""}
                    onChange={(e) => setCosts((c) => ({ ...c, tuition: e.target.value }))}
                    placeholder="1,000 - 7,000 EUR/year"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Living costs</Label>
                  <Input
                    value={costs.living ?? ""}
                    onChange={(e) => setCosts((c) => ({ ...c, living: e.target.value }))}
                    placeholder="600 - 1,000 EUR/month"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Scholarships</Label>
                  <Textarea
                    value={costs.scholarships ?? ""}
                    onChange={(e) => setCosts((c) => ({ ...c, scholarships: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              <TabsContent value="requirements" className="space-y-3 pt-3">
                <div>
                  <Label>Visa</Label>
                  <Textarea
                    value={requirements.visa ?? ""}
                    onChange={(e) => setRequirements((r) => ({ ...r, visa: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Textarea
                    value={requirements.language ?? ""}
                    onChange={(e) => setRequirements((r) => ({ ...r, language: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Documents</Label>
                  <Textarea
                    value={requirements.documents ?? ""}
                    onChange={(e) => setRequirements((r) => ({ ...r, documents: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              <TabsContent value="living" className="space-y-3 pt-3">
                <div>
                  <Label>Accommodation</Label>
                  <Textarea
                    value={living.accommodation ?? ""}
                    onChange={(e) => setLiving((l) => ({ ...l, accommodation: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Lifestyle</Label>
                  <Textarea
                    value={living.lifestyle ?? ""}
                    onChange={(e) => setLiving((l) => ({ ...l, lifestyle: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Testimonial</Label>
                  <Textarea
                    value={living.testimonial ?? ""}
                    onChange={(e) => setLiving((l) => ({ ...l, testimonial: e.target.value }))}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete study?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the destination from the site and etudes page. Applications already linked to this country will keep the target country value but the destination card will no longer appear.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
