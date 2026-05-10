import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const [selectedAge, setSelectedAge] = useState('0-3');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: '🌸 Namaste! Main MUMAA AI hoon. 🤱\n\nAap baby ke baare mein koi bhi sawaal pooch sakti hain Hinglish mein!\n\nExample: "3 mahine ke baby ka head control kab tak aana chahiye?"', isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  // Simulated AI responses
  const getAIResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('head control') || lowerMsg.includes('3 mahine')) {
      return "🌸 3-4 mahine mein baby ka head control aana chahiye.\n\n📌 Tummy time tips:\n• Daily 2-3 baar karein\n• 5-10 minute each session\n• Isse neck muscles strong hoti hain 💪";
    }
    else if (lowerMsg.includes('fever') || lowerMsg.includes('bukhar')) {
      return "🌡️ Baby ko fever hai toh:\n\n1️⃣ Doctor se contact karein\n2️⃣ Baby ko breastfeed karte rahein\n3️⃣ Temperature monitor karein\n4️⃣ 100°F se upar ho toh doctor dikhao\n\n🚨 Emergency: 108";
    }
    else if (lowerMsg.includes('sleep') || lowerMsg.includes('neend') || lowerMsg.includes('sota')) {
      return "😴 Baby ki sleep routine ke liye:\n\n• Same time daily sulaayein\n• Dark room banayein\n• White noise use karein\n• Feeding ke baad sulaayein\n• 0-3 months: 14-17 ghante neend 💤";
    }
    else if (lowerMsg.includes('feeding') || lowerMsg.includes('dudh')) {
      return "🍼 Feeding schedule:\n\n• Newborn: Har 2-3 ghante\n• 0-3 months: 8-12 times daily\n• 3-6 months: 6-8 times daily\n• 6-12 months: 4-6 times + solids\n\n💧 Wet diapers: 6-8 daily = sufficient milk!";
    }
    else if (lowerMsg.includes('weight')) {
      return "📈 Baby weight growth:\n\n• 0-3 months: 150-200g per week\n• 3-6 months: 100-150g per week\n• 6-12 months: 70-90g per week\n• 1-2 years: 2-2.5kg per year\n\n👶 Double birth weight by 5-6 months";
    }
    else if (lowerMsg.includes('vaccine') || lowerMsg.includes('vaccination')) {
      return "💉 India Vaccination Schedule:\n\n• Birth: BCG, Hep B, OPV\n• 6 weeks: DPT, IPV, Hep B, Hib, Rotavirus\n• 10 weeks: DPT, IPV, Hib, Rotavirus\n• 14 weeks: DPT, IPV, Hib, Rotavirus\n• 9 months: MMR\n• 12 months: Hep A\n• 15 months: MMR booster\n• 16-24 months: DPT booster\n\n📞 Ask your pediatrician for full schedule!";
    }
    else if (lowerMsg.includes('cry') || lowerMsg.includes('rona')) {
      return "😢 Baby ke rone ke karan aur solution:\n\n• 🍼 भूख → Feeding karein\n• 💨 गैस → Burp karein, legs cycle\n• 😴 थकान → Sulaayein\n• 💧 गीला डायपर → Change karein\n• 🦷 दर्द → Teething gel (doctor se poochhein)";
    }
    else if (lowerMsg.includes('teeth') || lowerMsg.includes('daant')) {
      return "🦷 Teething (daant nikalna):\n\n• Time: 6-9 months mein shuru\n• Symptoms: Rona, fever, feeding kam\n• Solution: Teething toy, cold cloth\n• Doctor se poochhein safe gel ke liye";
    }
    else {
      return "🌸 Main aapki madad kar sakti hoon! Kya aap poochna chahte hain:\n\n• 🍼 Feeding schedule\n• 🌡️ Fever management\n• 😴 Sleep tips\n• 📈 Weight growth\n• 💉 Vaccination schedule\n• 😢 Cry analysis\n• 🦷 Teething\n• 🧠 Brain development\n\n✨ Hinglish mein poochhein!";
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { id: Date.now().toString(), text: userMessage, isUser: true }]);
    setIsLoading(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    const aiResponse = await getAIResponse(userMessage);
    setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: aiResponse, isUser: false }]);
    setIsLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const quickReplies = [
    { emoji: '🌸', text: '3 mahine ke baby ka head control?' },
    { emoji: '🌡️', text: 'Baby ko fever hai?' },
    { emoji: '😴', text: 'Baby raat ko nahi sota?' },
    { emoji: '🍼', text: 'Feeding schedule?' },
    { emoji: '💉', text: 'Vaccination schedule?' },
    { emoji: '😢', text: 'Baby kyun ro raha hai?' },
  ];

  // Complete Milestones Data
  const milestonesData = {
    '0-3': {
      title: '🌱 0-3 Months (Newborn)',
      grossMotor: ['✓ Lifts head when on tummy', '✓ Turns head side to side', '✓ Slight head control when held upright'],
      fineMotor: ['✓ Hands in fists', '✓ Grasp reflex', '✓ Follows faces with eyes'],
      sensory: ['✓ Responds to sounds', '✓ Sensitive to light', '✓ Recognizes mother\'s voice'],
      language: ['✓ Makes cooing sounds', '✓ Cries to communicate', '✓ Startles at loud sounds'],
      social: ['✓ Social smile by 2 months', '✓ Watches faces', '✓ Responds to voice'],
      redFlags: ['❌ No head control by 3-4 months', '❌ Hands still fisted after 3 months', '❌ No social smile by 2-3 months']
    },
    '4-6': {
      title: '🌟 4-6 Months (Explorer)',
      grossMotor: ['✓ Rolls over (front to back)', '✓ Sits with support', '✓ Head control strong', '✓ Pushes up on forearms'],
      fineMotor: ['✓ Reaches for objects', '✓ Holds toys briefly', '✓ Brings hands to mouth', '✓ Palmar grasp'],
      sensory: ['✓ Enjoys colorful toys', '✓ Responds to name', '✓ Turns head to sounds'],
      language: ['✓ Babbles (ba, da, ma)', '✓ Laughs aloud', '✓ Makes squealing sounds'],
      social: ['✓ Recognizes familiar faces', '✓ Shows excitement', '✓ Smiles at mirror'],
      redFlags: ['❌ Not rolling over by 6 months', '❌ No babbling', '❌ Stiff or floppy body']
    },
    '7-9': {
      title: '🚀 7-9 Months (Active)',
      grossMotor: ['✓ Sits without support', '✓ Crawls/creeps', '✓ Pulls to stand', '✓ Bounces when held standing'],
      fineMotor: ['✓ Transfers objects hand-to-hand', '✓ Bangs objects together', '✓ Raking grasp', '✓ Explores with mouth'],
      sensory: ['✓ Responds to own name', '✓ Enjoys peek-a-boo', '✓ Localizes sound'],
      language: ['✓ Says "mama"/"dada" (non-specific)', '✓ Imitates sounds', '✓ Understands "no"'],
      social: ['✓ Stranger anxiety begins', '✓ Waves bye-bye', '✓ Plays peek-a-boo'],
      redFlags: ['❌ Not sitting by 9 months', '❌ No babbling', '❌ Doesn\'t respond to name']
    },
    '10-12': {
      title: '🎉 10-12 Months (Moving!)',
      grossMotor: ['✓ Pulls to stand and cruises', '✓ Stands briefly alone', '✓ May take first steps', '✓ Walks with support'],
      fineMotor: ['✓ Pincer grasp (thumb and finger)', '✓ Picks up small objects', '✓ Points with finger', '✓ Drops toys intentionally'],
      sensory: ['✓ Explores cause-effect', '✓ Enjoys dropping objects', '✓ Responds to music'],
      language: ['✓ Says 1-3 meaningful words', '✓ Understands simple commands', '✓ Waves bye-bye on command', '✓ Shakes head "no"'],
      social: ['✓ Shows affection to caregivers', '✓ Shows fear of strangers', '✓ Imitates actions'],
      redFlags: ['❌ Not crawling', '❌ No single words by 12 months', '❌ Doesn\'t point or wave']
    },
    '1-2': {
      title: '🏃 1-2 Years (Toddler)',
      grossMotor: ['✓ Walks independently', '✓ Runs clumsily', '✓ Climbs furniture', '✓ Kicks ball', '✓ Walks backwards'],
      fineMotor: ['✓ Scribbles with crayon', '✓ Builds tower of 2-4 blocks', '✓ Turns book pages', '✓ Uses spoon with spills'],
      sensory: ['✓ Enjoys sand/water play', '✓ Recognizes familiar objects', '✓ Responds to music'],
      language: ['✓ Says 10-50 words', '✓ Uses 2-word phrases ("more milk")', '✓ Points to body parts', '✓ Follows simple commands'],
      social: ['✓ Parallel play', '✓ Shows temper tantrums', '✓ Imitates adults', '✓ Says "no" often'],
      redFlags: ['❌ No walking by 18 months', '❌ No words by 16 months', '❌ No 2-word phrases by 24 months']
    },
    '2-3': {
      title: '🎨 2-3 Years (Preschool Prep)',
      grossMotor: ['✓ Runs well', '✓ Jumps in place', '✓ Walks up stairs alternating feet', '✓ Pedals tricycle'],
      fineMotor: ['✓ Builds tower of 6-8 blocks', '✓ Copies vertical/horizontal lines', '✓ Turns pages one by one', '✓ Uses spoon/fork'],
      sensory: ['✓ Recognizes colors', '✓ Sorts shapes', '✓ Understands size concepts'],
      language: ['✓ Says 50-200 words', '✓ Uses 3-4 word sentences', '✓ Names familiar objects', '✓ Speech understandable 75%'],
      social: ['✓ Plays alongside others', '✓ Shows emotions clearly', '✓ Takes turns', '✓ Toilet training begins'],
      redFlags: ['❌ No phrases by 2.5 years', '❌ Poor eye contact', '❌ No pretend play']
    },
    '3-5': {
      title: '📚 3-5 Years (Kindergarten Ready)',
      grossMotor: ['✓ Hops on one foot', '✓ Skips', '✓ Catches ball', '✓ Walks downstairs alternating', '✓ Balance on one foot 5+ sec'],
      fineMotor: ['✓ Draws circle/square', '✓ Uses scissors', '✓ Buttons clothes', '✓ Copies letters', '✓ Draws person with 2-4 parts'],
      sensory: ['✓ Recognizes letters/numbers', '✓ Understands time concepts', '✓ Good hand-eye coordination'],
      language: ['✓ 500-1000+ words', '✓ Tells stories', '✓ Understands questions', '✓ Speech clear and fluent'],
      social: ['✓ Cooperative play', '✓ Shares toys', '✓ Follows rules', '✓ Shows empathy', '✓ Makes friends'],
      redFlags: ['❌ Speech unclear by 3 years', '❌ No sentences by 3 years', '❌ No interest in other children']
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🤱</Text>
        <Text style={styles.headerTitle}>MUMAA</Text>
        <Text style={styles.headerSub}>Your AI Parenting Companion</Text>
        {babyName ? <Text style={styles.babyBadge}>👶 {babyName} • {babyAge} months</Text> : null}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'home' && styles.activeTab]} onPress={() => setActiveTab('home')}>
          <Text style={styles.tabEmoji}>🏠</Text>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'chat' && styles.activeTab]} onPress={() => setActiveTab('chat')}>
          <Text style={styles.tabEmoji}>💬</Text>
          <Text style={styles.tabText}>AI Chat</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <View>
            {/* Hero Section */}
            <View style={styles.heroCard}>
              <Text style={styles.heroEmoji}>🌸👶🤱</Text>
              <Text style={styles.heroTitle}>Welcome to MUMAA!</Text>
              <Text style={styles.heroText}>Your AI-powered parenting companion. Ask me anything about your baby's health, development, and growth.</Text>
            </View>

            {/* Baby Profile Card */}
            <View style={styles.profileCard}>
              <Text style={styles.cardTitle}>👶 Baby Profile</Text>
              <View style={styles.profileRow}>
                <View style={styles.profileInputWrapper}>
                  <Text style={styles.inputLabel}>Baby's Name</Text>
                  <TextInput style={styles.profileInput} placeholder="e.g., Aadhya" value={babyName} onChangeText={setBabyName} />
                </View>
                <View style={[styles.profileInputWrapper, { width: 120 }]}>
                  <Text style={styles.inputLabel}>Age (months)</Text>
                  <TextInput style={styles.profileInput} placeholder="0-60" keyboardType="numeric" value={babyAge} onChangeText={setBabyAge} />
                </View>
                <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('✅ Saved', `Profile saved for ${babyName || 'baby'}!`)}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>📊</Text>
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>Milestone Stages</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>💬</Text>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>AI Support</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🚨</Text>
                <Text style={styles.statNumber}>4+</Text>
                <Text style={styles.statLabel}>Helplines</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>✨ Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('chat')}>
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionTitle}>Ask AI</Text>
                <Text style={styles.actionDesc}>Get instant answers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('milestones')}>
                <Text style={styles.actionEmoji}>📊</Text>
                <Text style={styles.actionTitle}>Milestones</Text>
                <Text style={styles.actionDesc}>Track development</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('🍼 Cry Translator', 'Coming soon! Baby cry analysis feature.')}>
                <Text style={styles.actionEmoji}>🍼</Text>
                <Text style={styles.actionTitle}>Cry Translator</Text>
                <Text style={styles.actionDesc}>Understand baby's cry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('📅 Growth Tracker', 'Coming soon! Track weight, height, and head circumference.')}>
                <Text style={styles.actionEmoji}>📈</Text>
                <Text style={styles.actionTitle}>Growth Tracker</Text>
                <Text style={styles.actionDesc}>Monitor growth</Text>
              </TouchableOpacity>
            </View>

            {/* Daily Tip */}
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>✨ Daily Parenting Tip</Text>
              <Text style={styles.tipText}>📖 Read to your baby for 10 minutes daily. It boosts language development, brain growth, and bonding! 🌸</Text>
            </View>

            {/* Fun Fact */}
            <View style={styles.funFactCard}>
              <Text style={styles.funFactTitle}>💡 Did You Know?</Text>
              <Text style={styles.funFactText}>Baby's brain doubles in size during the first year! Talking, reading, and singing helps build neural connections. 🧠✨</Text>
            </View>
          </View>
        )}

        {/* AI CHAT TAB */}
        {activeTab === 'chat' && (
          <View>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>💬 Ask MUMAA AI</Text>
              <Text style={styles.chatSub}>पूछिए हिंग्लिश में | Ask any parenting question</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesContainer}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity key={index} style={styles.quickReplyBtn} onPress={() => setChatInput(reply.text)}>
                  <Text style={styles.quickReplyText}>{reply.emoji} {reply.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.chatMessages} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={[styles.chatBubble, msg.isUser ? styles.chatBubbleUser : styles.chatBubbleBot]}>
                  <Text style={msg.isUser ? styles.chatTextUser : styles.chatTextBot}>{msg.text}</Text>
                </View>
              ))}
              {isLoading && (
                <View style={styles.chatBubbleBot}>
                  <ActivityIndicator color="#FF6B6B" size="small" />
                  <Text style={styles.chatTextBot}> MUMAA soch rahi hai... 🤔</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputArea}>
              <TextInput style={styles.chatInput} placeholder="Hinglish mein likhein... (e.g., Baby ko fever hai)" value={chatInput} onChangeText={setChatInput} multiline />
              <TouchableOpacity style={styles.chatSendBtn} onPress={sendChatMessage} disabled={isLoading}>
                <Text style={styles.chatSendText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* MILESTONES TAB - COMPLETE */}
        {activeTab === 'milestones' && (
          <View>
            {/* Age Selector */}
            <Text style={styles.sectionTitle}>📊 Developmental Milestones</Text>
            <Text style={styles.sectionSubtitle}>Select your baby's age</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ageSelector}>
              {Object.keys(milestonesData).map((age) => (
                <TouchableOpacity key={age} style={[styles.ageButton, selectedAge === age && styles.ageButtonActive]} onPress={() => setSelectedAge(age)}>
                  <Text style={[styles.ageButtonText, selectedAge === age && styles.ageButtonTextActive]}>{age} months</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Milestone Details */}
            <View style={styles.milestoneCard}>
              <Text style={styles.milestoneTitle}>{milestonesData[selectedAge].title}</Text>
              
              <Text style={styles.milestoneCategory}>🏃 Gross Motor</Text>
              {milestonesData[selectedAge].grossMotor.map((item, i) => <Text key={i} style={styles.milestoneItem}>{item}</Text>)}
              
              <Text style={styles.milestoneCategory}>🖐️ Fine Motor</Text>
              {milestonesData[selectedAge].fineMotor.map((item, i) => <Text key={i} style={styles.milestoneItem}>{item}</Text>)}
              
              <Text style={styles.milestoneCategory}>👀 Sensory</Text>
              {milestonesData[selectedAge].sensory.map((item, i) => <Text key={i} style={styles.milestoneItem}>{item}</Text>)}
              
              <Text style={styles.milestoneCategory}>🗣️ Language</Text>
              {milestonesData[selectedAge].language.map((item, i) => <Text key={i} style={styles.milestoneItem}>{item}</Text>)}
              
              <Text style={styles.milestoneCategory}>👨‍👩‍👧 Social-Emotional</Text>
              {milestonesData[selectedAge].social.map((item, i) => <Text key={i} style={styles.milestoneItem}>{item}</Text>)}
              
              <View style={styles.redFlagBox}>
                <Text style={styles.redFlagTitle}>⚠️ Red Flags to Watch</Text>
                {milestonesData[selectedAge].redFlags.map((item, i) => <Text key={i} style={styles.redFlagItem}>{item}</Text>)}
                <Text style={styles.redFlagNote}>📞 Consult pediatrician if you notice these signs</Text>
              </View>
            </View>

            <Text style={styles.noteText}>💡 Remember: Every baby develops at their own pace. These are general guidelines.</Text>
          </View>
        )}

        {/* HELPLINES TAB */}
        {activeTab === 'helplines' && (
          <View>
            <Text style={styles.sectionTitle}>🚨 Emergency Helplines (24/7)</Text>
            <Text style={styles.sectionSubtitle}>Always available for immediate help</Text>
            
            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Child Helpline', 'Dial 1098 from your phone for immediate help for children in distress.')}>
              <Text style={styles.helplineIcon}>👶</Text>
              <View>
                <Text style={styles.helplineTitle}>Child Helpline</Text>
                <Text style={styles.helplineNumber}>1098</Text>
                <Text style={styles.helplineDesc}>24/7 for children in distress</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Medical Emergency', 'Dial 108 from your phone for ambulance and medical emergency.')}>
              <Text style={styles.helplineIcon}>🚑</Text>
              <View>
                <Text style={styles.helplineTitle}>Medical Emergency</Text>
                <Text style={styles.helplineNumber}>108</Text>
                <Text style={styles.helplineDesc}>Ambulance services</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Mental Health Helpline', 'iCall: +91-9152987821 (Mon-Sat, 10am-8pm) provides free mental health support.')}>
              <Text style={styles.helplineIcon}>💬</Text>
              <View>
                <Text style={styles.helplineTitle}>Mental Health Helpline</Text>
                <Text style={styles.helplineNumber}>iCall: +91-9152987821</Text>
                <Text style={styles.helplineDesc}>Mon-Sat, 10am-8pm</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Women Helpline', 'Dial 181 from your phone for women in distress.')}>
              <Text style={styles.helplineIcon}>👩</Text>
              <View>
                <Text style={styles.helplineTitle}>Women in Distress</Text>
                <Text style={styles.helplineNumber}>181</Text>
                <Text style={styles.helplineDesc}>24/7 helpline for women</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard} onPress={() => Alert.alert('📞 Call Poison Control', 'Dial 1066 from your phone for poisoning emergencies.')}>
              <Text style={styles.helplineIcon}>☠️</Text>
              <View>
                <Text style={styles.helplineTitle}>Poison Control</Text>
                <Text style={styles.helplineNumber}>1066</Text>
                <Text style={styles.helplineDesc}>24/7 emergency</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.emergencyTip}>
              <Text style={styles.emergencyTipTitle}>🚨 In case of emergency:</Text>
              <Text style={styles.emergencyTipText}>1. Stay calm</Text>
              <Text style={styles.emergencyTipText}>2. Call the helpline</Text>
              <Text style={styles.emergencyTipText}>3. Provide clear information</Text>
              <Text style={styles.emergencyTipText}>4. Follow instructions</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { backgroundColor: '#FF6B6B', paddingTop: 50, paddingBottom: 20, alignItems: 'center', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 5 },
  headerEmoji: { fontSize: 45 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginTop: 5 },
  headerSub: { fontSize: 12, color: '#FFE0E0', marginTop: 3 },
  babyBadge: { fontSize: 11, color: '#FFF', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 10, elevation: 3 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#FF6B6B' },
  tabEmoji: { fontSize: 22 },
  tabText: { fontSize: 11, color: '#666', marginTop: 3 },
  content: { flex: 1, padding: 15 },
  
  // Home Tab Styles
  heroCard: { backgroundColor: '#FF6B6B', borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center' },
  heroEmoji: { fontSize: 40, marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  heroText: { fontSize: 13, color: '#FFE0E0', textAlign: 'center', lineHeight: 20 },
  
  profileCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  profileInputWrapper: { flex: 1 },
  inputLabel: { fontSize: 11, color: '#999', marginBottom: 4 },
  profileInput: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#FFE0E0' },
  saveBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginHorizontal: 4, alignItems: 'center', elevation: 2 },
  statEmoji: { fontSize: 28 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B', marginTop: 5 },
  statLabel: { fontSize: 10, color: '#666', marginTop: 3 },
  
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  actionCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 12, alignItems: 'center', elevation: 2 },
  actionEmoji: { fontSize: 35, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  actionDesc: { fontSize: 10, color: '#999', marginTop: 3 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  sectionSubtitle: { fontSize: 12, color: '#999', marginBottom: 15, textAlign: 'center' },
  
  tipCard: { backgroundColor: '#FFE0E0', borderRadius: 15, padding: 18, marginBottom: 15 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 8 },
  tipText: { fontSize: 13, color: '#444', lineHeight: 20 },
  
  funFactCard: { backgroundColor: '#E8F5E9', borderRadius: 15, padding: 18, marginBottom: 15 },
  funFactTitle: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50', marginBottom: 8 },
  funFactText: { fontSize: 12, color: '#444', lineHeight: 18 },
  
  // Chat Tab Styles
  chatHeader: { marginBottom: 15 },
  chatTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  chatSub: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 4 },
  
  quickRepliesContainer: { flexDirection: 'row', marginBottom: 15 },
  quickReplyBtn: { backgroundColor: '#FFE0E0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  quickReplyText: { fontSize: 12, color: '#FF6B6B' },
  
  chatMessages: { height: 380, marginBottom: 15 },
  chatBubble: { padding: 12, borderRadius: 18, marginBottom: 10, maxWidth: '85%' },
  chatBubbleBot: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start' },
  chatBubbleUser: { backgroundColor: '#FF6B6B', alignSelf: 'flex-end' },
  chatTextBot: { fontSize: 13, color: '#333', lineHeight: 18 },
  chatTextUser: { fontSize: 13, color: '#FFF', lineHeight: 18 },
  
  chatInputArea: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 18, paddingVertical: 12, fontSize: 14, borderWidth: 1, borderColor: '#FFE0E0', maxHeight: 80 },
  chatSendBtn: { backgroundColor: '#FF6B6B', borderRadius: 30, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  chatSendText: { color: '#FFF', fontSize: 20 },
  
  // Milestones Tab Styles
  ageSelector: { flexDirection: 'row', marginBottom: 15 },
  ageButton: { backgroundColor: '#FFE0E0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, marginRight: 10 },
  ageButtonActive: { backgroundColor: '#FF6B6B' },
  ageButtonText: { fontSize: 13, color: '#FF6B6B' },
  ageButtonTextActive: { color: '#FFF', fontWeight: 'bold' },
  
  milestoneCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, elevation: 2 },
  milestoneTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 15, textAlign: 'center' },
  milestoneCategory: { fontSize: 15, fontWeight: '600', color: '#FF9999', marginTop: 12, marginBottom: 8 },
  milestoneItem: { fontSize: 13, color: '#555', marginBottom: 5, paddingLeft: 5 },
  
  redFlagBox: { backgroundColor: '#FFF3F0', borderRadius: 12, padding: 15, marginTop: 15, borderWidth: 1, borderColor: '#FFCDD2' },
  redFlagTitle: { fontSize: 14, fontWeight: 'bold', color: '#E53935', marginBottom: 10 },
  redFlagItem: { fontSize: 12, color: '#D32F2F', marginBottom: 5, paddingLeft: 5 },
  redFlagNote: { fontSize: 11, color: '#999', marginTop: 10, fontStyle: 'italic' },
  
  noteText: { fontSize: 11, color: '#999', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  
  // Helplines Tab Styles
  helplineCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 12, alignItems: 'center', elevation: 2 },
  helplineIcon: { fontSize: 40, marginRight: 15 },
  helplineTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  helplineNumber: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B', marginTop: 4 },
  helplineDesc: { fontSize: 11, color: '#999', marginTop: 3 },
  
  emergencyTip: { backgroundColor: '#FFF3F0', borderRadius: 15, padding: 18, marginTop: 10, marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2' },
  emergencyTipTitle: { fontSize: 14, fontWeight: 'bold', color: '#E53935', marginBottom: 10 },
  emergencyTipText: { fontSize: 12, color: '#666', marginBottom: 4, paddingLeft: 8 },
});
