import { useEffect, useState } from 'react';
import { Text, ScrollView, View, Pressable, ActivityIndicator } from 'react-native';
function colorFromId(id: number): string {
  const palette = [
    '#6C5CE7', '#00B894', '#0984E3', '#E17055',
    '#E84393', '#FDCB6E', '#00CEC9', '#A29BFE',
    '#55EFC4', '#FAB1A0', '#74B9FF', '#FD79A8',
  ];
  return palette[(id * 7) % palette.length];
}

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadPosts = () => {
  setLoading(true);
  setError(null);
  fetch('https://gorest.co.in/public/v2/posts')
    .then((res) => {
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setPosts(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
};

useEffect(() => {
  loadPosts();
}, []);

  return (
    <ScrollView style={{ backgroundColor: '#f0f0f5' }}>
        {loading && (
  <View style={{ padding: 40, alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#6C5CE7" />
    <Text style={{ marginTop: 12, color: '#666' }}>Loading posts...</Text>
  </View>
)}

{error && !loading && (
  <View style={{ padding: 40, alignItems: 'center' }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E74C3C', marginBottom: 8 }}>
      Something went wrong
    </Text>
    <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
      {error}
    </Text>
    <Pressable
      onPress={loadPosts}
      style={{
        backgroundColor: '#6C5CE7',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Try again</Text>
    </Pressable>
  </View>
)}
      {posts.map((post) => (
        <Pressable
          key={post.id}
          onPress={() => navigation.navigate('PostDetails', { post })}
          style={{
            backgroundColor: 'white',
            padding: 16,
            marginHorizontal: 12,
            marginVertical: 6,
            borderRadius: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colorFromId(post.user_id),
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                U{String(post.user_id).slice(0, 2)}
              </Text>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
              User #{post.user_id}
            </Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
            {post.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {post.body}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}