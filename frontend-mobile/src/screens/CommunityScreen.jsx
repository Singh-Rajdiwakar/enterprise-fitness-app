import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GlassBackground, GlassCard } from '../components/GlassLayout';
import Leaderboard from '../components/Leaderboard';
import { connectSocket } from '../services/socketService';
import { colors, radii, spacing, typography } from '../theme/theme';

const POSTS = [
  {
    id: 'post-1',
    userName: 'Nisha Rao',
    avatar: 'NR',
    text: 'Finished a 30-minute HIIT session and hit a new conditioning PR today.',
    fires: 18,
  },
  {
    id: 'post-2',
    userName: 'Aarav Mehta',
    avatar: 'AM',
    text: 'Transformation update: down 4 kg in 6 weeks. Nutrition consistency is doing the heavy lifting.',
    fires: 31,
  },
  {
    id: 'post-3',
    userName: 'Kabir Shah',
    avatar: 'KS',
    text: 'Completed Push-Pull-Legs week 3. Added 5 kg to deadlifts and kept rest times tight.',
    fires: 12,
  },
];

export default function CommunityScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(POSTS);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const socket = connectSocket();

    const handleNewPost = (payload = {}) => {
      setPosts((currentPosts) => [
        {
          id: payload.id || `post-${Date.now()}`,
          userName: payload.userName || payload.author || 'Community Member',
          avatar: payload.avatar || getInitials(payload.userName || payload.author || 'CM'),
          text: payload.text || payload.message || 'Shared a new fitness update.',
          fires: Number(payload.fires) || 0,
        },
        ...currentPosts,
      ]);
    };

    const handleNewMessage = (payload = {}) => {
      setPosts((currentPosts) => [
        {
          id: payload.id || `message-${Date.now()}`,
          userName: payload.userName || payload.from || 'Trainer Chat',
          avatar: payload.avatar || getInitials(payload.userName || payload.from || 'TC'),
          text: payload.text || payload.message || 'New message received.',
          fires: 0,
        },
        ...currentPosts,
      ]);
    };

    socket.on('new_post', handleNewPost);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_post', handleNewPost);
      socket.off('new_message', handleNewMessage);
    };
  }, []);

  const toggleLike = (postId) => {
    setLikedPosts((currentLikes) => ({
      ...currentLikes,
      [postId]: !currentLikes[postId],
    }));
  };

  return (
    <GlassBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={typography.eyebrow}>Community</Text>
            <Text style={styles.title}>Social Fitness Hub</Text>
            <Text style={styles.subtitle}>Follow progress, celebrate wins, and compare weekly consistency.</Text>
          </View>
        </View>

        <View style={styles.segmentedControl}>
          <TabButton title="Feed" active={activeTab === 'feed'} onPress={() => setActiveTab('feed')} />
          <TabButton title="Leaderboard" active={activeTab === 'leaderboard'} onPress={() => setActiveTab('leaderboard')} />
        </View>

        {activeTab === 'feed' ? (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.feedList}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                liked={Boolean(likedPosts[item.id])}
                onToggleLike={() => toggleLike(item.id)}
              />
            )}
          />
        ) : (
          <GlassCard style={styles.leaderboardCard}>
            <Leaderboard />
          </GlassCard>
        )}
      </ScrollView>
    </GlassBackground>
  );
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function TabButton({ title, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        active ? styles.activeTabButton : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.tabButtonText, active ? styles.activeTabButtonText : null]}>{title}</Text>
    </Pressable>
  );
}

function PostCard({ post, liked, onToggleLike }) {
  return (
    <GlassCard style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.postUser}>
          <Text style={styles.postName}>{post.userName}</Text>
          <Text style={styles.postMeta}>Community update</Text>
        </View>
      </View>

      <Text style={styles.postText}>{post.text}</Text>

      <Pressable
        onPress={onToggleLike}
        style={({ pressed }) => [
          styles.fireButton,
          liked ? styles.fireButtonActive : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.fireButtonText}>{liked ? 'Fired up' : 'Fire'}</Text>
        <Text style={styles.fireCount}>{post.fires + (liked ? 1 : 0)}</Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 64,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  headerText: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: spacing.xs,
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '800',
  },
  activeTabButtonText: {
    color: colors.text,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  feedList: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  postCard: {
    minHeight: 190,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(147, 197, 253, 0.18)',
  },
  avatarText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  postUser: {
    flex: 1,
    gap: spacing.xs,
  },
  postName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  postMeta: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  postText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.lg,
  },
  fireButton: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fireButtonActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(37, 99, 235, 0.28)',
  },
  fireButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  fireCount: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  leaderboardCard: {
    marginTop: spacing.lg,
  },
});
