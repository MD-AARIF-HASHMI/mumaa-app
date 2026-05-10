import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔑 PASTE YOUR GEMINI API KEY HERE
const GEMINI_API_KEY = 'PASTE_YOUR_API_KEY_HERE';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Namaste! Main MUMAA AI hoon. 🤱\n\nAap baby ke baare mein koi bhi sawaal pooch sakti hain:\n• Feeding schedule\n• Development milestones\n• Health concerns\n• Sleep problems\n\nHinglish ya Hindi mein poochhein!', isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  // Load saved data on start
  React.useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedBabyName = await AsyncStorage.getItem('babyName');
      const savedBabyAge = await AsyncStorage.getItem('babyAge');
      if (savedBabyName) setBabyName(savedBabyName);
      if (savedBabyAge) setBabyAge(savedBabyAge);
    } catch (error) {
      console.log('Error loading data');
    }
  };

  const saveBabyProfile = async () => {
    try {
      await AsyncStorage.setItem('babyName', babyName);
      await AsyncStorage.setItem('babyAge', babyAge);
      Alert.alert('✅ Saved', `Profile saved for ${babyName || 'baby'}!`);
    } catch (error) {
      Alert.alert('Error', 'Could not save profile');
    }
  };

  // Call Gemini API
  const callGeminiAPI = async (userMessage) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are MUMAA, a caring Indian parenting assistant. You speak Hinglish (Hindi + English mix). 
              Baby's name: ${babyName || 'baby'}, Age: ${babyAge || 'unknown'} months.
              Be empathetic, practical, and culturally relevant. Keep responses short (2-3 sentences).
              User question: ${userMessage}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let aiResponse = data.candidates[0].content.parts[0].text;
        // Clean up response
        aiResponse = aiResponse.replace(/\*\*/g, '');
        return aiResponse;
      } else {
        console.log('API Error:', data);
        return "Maaf karein, main samajh nahi payi. Kya aap dobara pooch sakti hain?";
      }
    } catch (error) {
      console.error('API Error:', error);
      return "Internet connection check karein. Agar problem ho toh baad mein try karein.";
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    // Check if API key is set
    if (GEMINI_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
      Alert.alert(
        '⚠️ API Key Required',
        'Please add your Gemini API key in the code.\n\nGet free key from: https://makersuite.google.com/app/apikey',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message
    setChatMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: userMessage, 
      isUser: true 
    }]);
    
    // Show loading indicator
    setIsLoading(true);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Get AI response
    const aiResponse = await callGeminiAPI(userMessage);
    
    // Add AI message
    setChatMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      text: aiResponse, 
      isUser: false 
    }]);
    
    setIsLoading(false);
    
    // Scroll to bottom again
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Quick reply buttons
  const quickReplies = [
    { emoji: '🍼', text: 'Feeding schedule kya hai?' },
    { emoji: '📊', text: 'Baby milestones?' },
    { emoji: '😴', text: 'Sleep problems?' },
    { emoji: '🌡️', text: 'Fever ho toh kya karein?' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🤱</Text>
        <Text style={styles.headerTitle}>MUMAA AI</Text>
        <Text style={styles.headerSub}>Powered by Google Gemini</Text>
        {babyName ? (
          <Text style={styles.babyNameBadge}>👶 {babyName}, {babyAge}m</Text>
        ) : null}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'home' && styles.activeTab]} onPress={() => setActiveTab('home')}>
          <Text style={styles.tabEmoji}>🏠</Text>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'chat' && styles.activeTab]} onPress={() => setActiveTab('chat')}>
          <Text style={styles.tabEmoji}>💬</Text>
          <Text style={styles.tabText}>MUMAA AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'milestones' && styles.activeTab]} onPress={() => setActiveTab('milestones')}>
          <Text style={styles.tabEmoji}>📊</Text>
          <Text style={styles.tabText}>Milestones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'helplines' && styles.activeTab]} onPress={() => setActiveTab('helplines')}>
          <Text style={styles.tabEmoji}>🚨</Text>
          <Text style={styles.tabText}>Helplines</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <View>
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeText}>Namaste! 👋</Text>
              <Text style={styles.welcomeSub}>Track your baby's growth and chat with MUMAA AI for instant answers.</Text>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>👶 Baby Profile</Text>
              <View style={styles.profileRow}>
                <TextInput 
                  style={styles.profileInput} 
                  placeholder="Baby's name" 
                  value={babyName}
                  onChangeText={setBabyName}
                  placeholderTextColor="#999"
                />
                <TextInput 
                  style={[styles.profileInput, { width: '30%' }]} 
                  placeholder="Age (months)" 
                  keyboardType="numeric"
                  value={babyAge}
                  onChangeText={setBabyAge}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.saveProfileBtn} onPress={saveBabyProfile}>
                  <Text style={styles.saveProfileBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.featureGrid}>
              <TouchableOpacity style={styles.featureCard} onPress={() => setActiveTab('chat')}>
                <Text style={styles.featureEmoji}>💬</Text>
                <Text style={styles.featureTitle}>Ask MUMAA AI</Text>
                <Text style={styles.featureDesc}>Get instant answers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featureCard} onPress={() => setActiveTab('milestones')}>
                <Text style={styles.featureEmoji}>📊</Text>
                <Text style={styles.featureTitle}>Milestones</Text>
                <Text style={styles.featureDesc}>Track development</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featureCard} onPress={() => Alert.alert('🍼 Cry Translator', 'Recording for 10 seconds...\n\nBaby seems HUNGRY!\n\nTip: Try feeding or check diaper.')}>
                <Text style={styles.featureEmoji}>🍼</Text>
                <Text style={styles.featureTitle}>Cry Translator</Text>
                <Text style={styles.featureDesc}>10 sec → understand cry</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featureCard} onPress={() => setActiveTab('helplines')}>
                <Text style={styles.featureEmoji}>🚨</Text>
                <Text style={styles.featureTitle}>Emergency</Text>
                <Text style={styles.featureDesc}>24/7 Helplines</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipSection}>
              <Text style={styles.sectionTitle}>✨ Daily Parenting Tip</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>📖 Read to your baby for 10 minutes daily. It boosts language development and bonding!</Text>
              </View>
            </View>
          </View>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>💬 Ask MUMAA AI</Text>
              <Text style={styles.chatSub}>पूछिए हिंग्लिश में | Ask any parenting question</Text>
            </View>

            {/* Quick Reply Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesContainer}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity key={index} style={styles.quickReplyBtn} onPress={() => setChatInput(reply.text)}>
                  <Text style={styles.quickReplyText}>{reply.emoji} {reply.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Chat Messages */}
            <ScrollView 
              style={styles.chatMessages} 
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {chatMessages.map((msg) => (
                <View key={msg.id} style={[styles.chatBubble, msg.isUser ? styles.chatBubbleUser : styles.chatBubbleBot]}>
                  <Text style={msg.isUser ? styles.chatTextUser : styles.chatTextBot}>{msg.text}</Text>
                </View>
              ))}
              {isLoading && (
                <View style={styles.chatBubbleBot}>
                  <ActivityIndicator color="#FF6B6B" size="small" />
                  <Text style={styles.chatTextBot}>MUMAA soch rahi hai... 🤔</Text>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.chatInputArea}>
              <TextInput 
                style={styles.chatInput} 
                placeholder="Hinglish mein likhein... (e.g., Baby ko fever hai)" 
                placeholderTextColor="#999"
                value={chatInput}
                onChangeText={setChatInput}
                multiline
              />
              <TouchableOpacity style={styles.chatSendButton} onPress={sendChatMessage} disabled={isLoading}>
                <Text style={styles.chatSendText}>➤</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <View>
            <Text style={styles.sectionTitle}>📊 Developmental Milestones</Text>
            
            <View style={styles.ageSelector}>
              {['0-3m', '4-6m', '7-9m', '10-12m', '1-2y', '2-3y', '3-5y'].map((age) => (
                <TouchableOpacity key={age} style={styles.ageButton}>
                  <Text style={styles.ageButtonText}>{age}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>🎯 0-3 Months</Text>
              <Text style={styles.milestoneItem}>✓ Lifts head when on tummy</Text>
              <Text style={styles.milestoneItem}>✓ Follows faces with eyes</Text>
              <Text style={styles.milestoneItem}>✓ Makes cooing sounds</Text>
              <Text style={styles.milestoneItem}>✓ Social smile by 2 months</Text>
              <TouchableOpacity style={styles.warningButton} onPress={() => Alert.alert('⚠️ Red Flags', '• No head control by 3-4 months\n• Hands still fisted after 3 months\n• No social smile by 2-3 months\n\nConsult pediatrician immediately.')}>
                <Text style={styles.warningButtonText}>⚠️ View Red Flags</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>🎯 4-6 Months</Text>
              <Text style={styles.milestoneItem}>✓ Rolls over (front to back)</Text>
              <Text style={styles.milestoneItem}>✓ Sits with support</Text>
              <Text style={styles.milestoneItem}>✓ Reaches for objects</Text>
              <Text style={styles.milestoneItem}>✓ Babbles (ba, da, ma)</Text>
            </View>

            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>🎯 7-12 Months</Text>
              <Text style={styles.milestoneItem}>✓ Sits without support</Text>
              <Text style={styles.milestoneItem}>✓ Crawls/creeps</Text>
              <Text style={styles.milestoneItem}>✓ Says "mama"/"dada"</Text>
              <Text style={styles.milestoneItem}>✓ Waves bye-bye</Text>
              <Text style={styles.milestoneItem}>✓ Takes first steps</Text>
            </View>
          </View>
        )}

        {/* HELPLINES TAB */}
        {activeTab === 'helplines' && (
          <View>
            <Text style={styles.sectionTitle}>🚨 Emergency Helplines (24/7)</Text>
            
            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Child Helpline', 'Dial 1098 from your phone for immediate help.')}>
              <Text style={styles.helplineTitle}>👶 Child Helpline</Text>
              <Text style={styles.helplineNumber}>1098</Text>
              <Text style={styles.helplineDesc}>For children in distress</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Medical Emergency', 'Dial 108 from your phone for ambulance.')}>
              <Text style={styles.helplineTitle}>🚑 Medical Emergency</Text>
              <Text style={styles.helplineNumber}>108</Text>
              <Text style={styles.helplineDesc}>Ambulance services</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Mental Health Helpline', 'iCall: +91-9152987821 (Mon-Sat, 10am-8pm)')}>
              <Text style={styles.helplineTitle}>💬 Mental Health</Text>
              <Text style={styles.helplineNumber}>iCall: +91-9152987821</Text>
              <Text style={styles.helplineDesc}>Mon-Sat, 10am-8pm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Women Helpline', 'Dial 181 from your phone.')}>
              <Text style={styles.helplineTitle}>👩 Women in Distress</Text>
              <Text style={styles.helplineNumber}>181</Text>
              <Text style={styles.helplineDesc}>24/7 helpline for women</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Poison Control', 'Dial 1066 for poisoning emergencies.')}>
              <Text style={styles.helplineTitle}>☠️ Poison Control</Text>
              <Text style={styles.helplineNumber}>1066</Text>
              <Text style={styles.helplineDesc}>24/7 emergency</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { backgroundColor: '#FF6B6B', paddingTop: 40, paddingBottom: 15, alignItems: 'center' },
  headerEmoji: { fontSize: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 5 },
  headerSub: { fontSize: 10, color: '#FFE0E0', marginTop: 2 },
  babyNameBadge: { fontSize: 11, color: '#FFF', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15, marginTop: 5 },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 8, elevation: 3 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF6B6B' },
  tabEmoji: { fontSize: 20 },
  tabText: { fontSize: 10, color: '#666', marginTop: 2 },
  content: { flex: 1, padding: 12 },
  welcomeCard: { backgroundColor: '#FF6B6B', borderRadius: 15, padding: 15, marginBottom: 15 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  welcomeSub: { fontSize: 12, color: '#FFE0E0', marginTop: 5 },
  profileSection: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, fontSize: 14 },
  saveProfileBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  saveProfileBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, alignItems: 'center', elevation: 2 },
  featureEmoji: { fontSize: 35 },
  featureTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  featureDesc: { fontSize: 10, color: '#666', textAlign: 'center', marginTop: 3 },
  tipSection: { marginTop: 5 },
  tipCard: { backgroundColor: '#FFE0E0', borderRadius: 12, padding: 12 },
  tipText: { fontSize: 12, color: '#333' },
  chatHeader: { marginBottom: 12 },
  chatTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  chatSub: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 3 },
  quickRepliesContainer: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 5 },
  quickReplyBtn: { backgroundColor: '#FFE0E0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  quickReplyText: { fontSize: 11, color: '#FF6B6B' },
  chatMessages: { height: 350, marginBottom: 12 },
  chatBubble: { padding: 10, borderRadius: 15, marginBottom: 8, maxWidth: '85%' },
  chatBubbleBot: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start' },
  chatBubbleUser: { backgroundColor: '#FF6B6B', alignSelf: 'flex-end' },
  chatTextBot: { fontSize: 13, color: '#333' },
  chatTextUser: { fontSize: 13, color: '#FFF' },
  chatInputArea: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  chatInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, fontSize: 13, borderWidth: 1, borderColor: '#FFE0E0', maxHeight: 80 },
  chatSendButton: { backgroundColor: '#FF6B6B', borderRadius: 25, width: 45, height: 45, alignItems: 'center', justifyContent: 'center' },
  chatSendText: { color: '#FFF', fontSize: 18 },
  ageSelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  ageButton: { backgroundColor: '#FFE0E0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, margin: 3 },
  ageButtonText: { fontSize: 11, color: '#FF6B6B' },
  milestoneCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2 },
  milestoneTitle: { fontSize: 15, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 8 },
  milestoneItem: { fontSize: 12, color: '#444', marginBottom: 4 },
  warningButton: { backgroundColor: '#FFE0E0', padding: 8, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  warningButtonText: { color: '#FF6B6B', fontSize: 11, fontWeight: 'bold' },
  helplineCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 2 },
  helplineTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  helplineNumber: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B', marginTop: 4 },
  helplineDesc: { fontSize: 11, color: '#666', marginTop: 3 },
});
