import { useEffect, useState } from 'react';
import { Text, ScrollView, View, Pressable, ActivityIndicator } from 'react-native';

function colorFromString(str: string): string {
  const palette = [
    '#6C5CE7', '#00B894', '#0984E3', '#E17055',
    '#E84393', '#FDCB6E', '#00CEC9', '#A29BFE',
  ];
  // Sum the character codes so the same name always gets the same color
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return palette[sum % palette.length];
}

function initials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function PostDetailsScreen({ route }: any) {
  const { post } = route.params;
  const [comments, setComments] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadComments = () => {
  setLoading(true);
  setError(null);
  fetch(`https://gorest.co.in/public/v2/posts/${post.id}/comments`)
    .then((res) => {
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return res.json();
    })
    .then((data) => {
      setComments(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
};

useEffect(() => {
  loadComments();
}, []);

  return (
    <ScrollView style={{ backgroundColor: '#f0f0f5' }}>
      {/* The post itself, on top */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          margin: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
          User #{post.user_id}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
          {post.title}
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 22 }}>
          {post.body}
        </Text>
      </View>

      {/* Comments section */}
      {loading && (
  <View style={{ padding: 30, alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#6C5CE7" />
    <Text style={{ marginTop: 12, color: '#666' }}>Loading comments...</Text>
  </View>
)}

{error && !loading && (
  <View style={{ padding: 30, alignItems: 'center' }}>
    <Text style={{ color: '#E74C3C', marginBottom: 12 }}>
      Couldn't load comments: {error}
    </Text>
    <Pressable
      onPress={loadComments}
      style={{
        backgroundColor: '#6C5CE7',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Try again</Text>
    </Pressable>
  </View>
)}

{!loading && !error && comments.length === 0 && (
  <View style={{ padding: 30, alignItems: 'center' }}>
    <Text style={{ color: '#999' }}>No comments yet.</Text>
  </View>
)}

      {comments.map((comment) => (
        <View
          key={comment.id}
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            padding: 12,
            marginHorizontal: 12,
            marginVertical: 4,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colorFromString(comment.email),
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
              {initials(comment.name)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
              {comment.name}
            </Text>
            <Text style={{ fontSize: 13, color: '#555', lineHeight: 18 }}>
              {comment.body}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}