import { ScrollView, Text, StyleSheet } from 'react-native';

export default function Screen({ title, lead, children }) {
  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {lead ? <Text style={s.lead}>{lead}</Text> : null}
      {children}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: '#F5F6FA', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1D3A' },
  lead: { marginTop: 6, fontSize: 16, color: '#6A6F8C', lineHeight: 22 },
});
