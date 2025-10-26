import { TagItem } from '@/components/admin/settlements/tags/Item';
import { NewTagItem } from '@/components/admin/settlements/tags/NewItem';
import { fetchData } from '@/lib/fetch';
import { BaseTag, Tag } from '@/lib/types';
import { sortAlphabetically } from '@/utils/sortAlphabetically';
import { useEffect, useState } from 'react';

interface TagListProps {
  existingTags: Tag[];
  settlementId: string;
  className?: string;
  getSettlement: () => Promise<void>;
}

export function TagList({
  existingTags,
  settlementId,
  className = '',
  getSettlement,
}: TagListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  async function removeTag(tagId: string) {
    setLoading(true);
    await fetchData(`/api/tags/delete/settlement/${tagId}/${settlementId}`);
    await getSettlement();
    setLoading(false);
  }

  async function addTag(tagId: string, settlementId: string) {
    setLoading(true);
    await fetchData(`/api/settlements/add/tag/${settlementId}/${tagId}`);
    await getSettlement();
    setLoading(false);
  }

  async function getAvailableTags() {
    setLoading(true);
    const tags = await fetchData<BaseTag[], BaseTag[]>('/api/tags/get/all', []);
    if (tags.length > 0) {
      const filteredTags = tags.filter(
        (tag: Tag) =>
          !existingTags.map((existingTag) => existingTag.id).includes(tag.id),
      );
      setAvailableTags(filteredTags);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAvailableTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className={`inline-flex ${className}`}>
      {sortAlphabetically(existingTags).map((tag: Tag) => (
        <TagItem onClick={() => removeTag(tag.id)} key={tag.id} tag={tag} />
      ))}
      {!loading && availableTags.length > 0 && (
        <NewTagItem
          onAdd={(tagId) => addTag(tagId, settlementId)}
          availableTags={availableTags}
        />
      )}
    </ul>
  );
}
