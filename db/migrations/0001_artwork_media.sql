PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS `artwork_media` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `artwork_id` integer NOT NULL,
  `type` text NOT NULL,
  `path` text NOT NULL,
  `alt_text` text,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `autoplay` integer DEFAULT true NOT NULL,
  `muted` integer DEFAULT true NOT NULL,
  `loop` integer DEFAULT true NOT NULL,
  `controls` integer DEFAULT true NOT NULL,
  `created_at` text NOT NULL,
  FOREIGN KEY (`artwork_id`) REFERENCES `artworks`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX IF NOT EXISTS `artwork_media_artwork_id_idx` ON `artwork_media` (`artwork_id`);
