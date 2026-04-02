import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/GlassCard';

// Mock Data to match the "Jonn Smith" posts in your image
const DATA = [
  {
    id: '1',
    user: 'Jonn Smith',
    time: '2m ago',
    content: 'Checking out the new platform!',
    images: ['https://picsum.photos/200/300', 'https://picsum.photos/201/300'],
  },
  {
    id: '2',
    user: 'Jonn Smith',
    time: '2m ago',
    content: 'Checking out the new platform! Just testing out the new glassmorphism UI.',
    images: ['https://picsum.photos/202/300', 'https://picsum.photos/203/300', 'https://picsum.photos/204/300'],
  },
];

export default function HomeScreen() {
  const renderPost = ({ item }) => (
    <GlassCard style={styles.postCard}>
      {/* User Info Header */}
      <View style={styles.userRow}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Image Grid */}
      <View style={styles.imageGrid}>
        {item.images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.postImage} />
        ))}
      </View>

      {/* Interaction Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart" size={20} color="#00E5FF" />
          <Text style={[styles.actionText, { color: '#00E5FF' }]}>Heart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <LinearGradient colors={['#1e293b', '#0f172a', '#020617']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="infinite" size={30} color="#00E5FF" />
            <Text style={styles.headerTitle}>Social Connect</Text>
          </View>
        </View>

        <FlatList
          data={DATA}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  listPadding: { padding: 15, paddingBottom: 100 },
  
  postCard: { marginBottom: 20, padding: 15 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  timeText: { color: '#64748b', fontSize: 12 },
  moreBtn: { marginLeft: 'auto' },

  postContent: { color: '#fff', fontSize: 14, lineHeight: 20, marginBottom: 15 },
  
  imageGrid: { flexDirection: 'row', gap: 8, marginBottom: 15 },
  postImage: { flex: 1, height: 120, borderRadius: 12, backgroundColor: '#1e293b' },

  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.1)', 
    paddingTop: 12 
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { color: '#fff', marginLeft: 6, fontSize: 13, fontWeight: '500' }
});