import PlaylistDetailView from "@/components/organisms/PlaylistDetailView";

export default function Page({ params }) {
    const { slug } = params;
    return <PlaylistDetailView slug={slug} />;
}
