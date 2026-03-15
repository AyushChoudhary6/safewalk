import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface PhotoGalleryProps {
  photos?: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  // Use provided photos or placeholders
  const largePhoto = photos && photos.length > 0 ? photos[0] : 'https://picsum.photos/400/400';
  const smallPhoto1 = photos && photos.length > 1 ? photos[1] : 'https://picsum.photos/200/200';
  const smallPhoto2 = photos && photos.length > 2 ? photos[2] : 'https://picsum.photos/200/201';

  return (
    <View style={styles.photosGrid}>
      <View style={styles.largePhoto}>
        <Image source={{ uri: largePhoto }} style={styles.imageFull} />
      </View>
      <View style={styles.smallPhotosCol}>
        <Image source={{ uri: smallPhoto1 }} style={styles.imageHalf} />
        <Image source={{ uri: smallPhoto2 }} style={styles.imageHalf} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photosGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    height: 300,
    marginBottom: 16,
  },
  largePhoto: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  smallPhotosCol: {
    flex: 1,
    gap: 8,
  },
  imageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageHalf: {
    width: '100%',
    flex: 1,
    borderRadius: 16,
    resizeMode: 'cover',
  },
});
