import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform, ScrollView } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { colors, spacing, typography, shadows } from '../theme/colors';
import { Footer } from '../components/Footer';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - spacing.md * 3) / 2;

const mockCocktails = [
  {
    id: '1',
    name: "Chilled Chum",
    image: require('../../assets/images/Chilled Chum Clip Art.jpeg'),
    ingredients: [
      '1.5 oz Bourbon (Maker\'s Mark)',
      '0.75 oz Aperol',
      '0.5 oz Fresh Lemon Juice',
      '0.25 tsp Fresh Ginger (finely grated on a microplane)',
      '1.5 oz Bundaberg Ginger Beer (to top)',
      'Optional: Pinch of edible cocktail glitter',
      'Garnish: Fresh mint sprig and a carved grapefruit peel (shaped into Conan\'s pompadour)',
    ],
    steps: [
      'Shake: Add bourbon, Aperol, lemon juice, grated ginger, and optional glitter into an ice-filled shaker.',
      'Chill: Shake vigorously for 15 seconds until the tin frosts over.',
      'Double Strain: Fine-strain over fresh rocks into a chilled tumbler or rocks glass.',
      'Top: Gently pour ginger beer, give a slow stir to integrate.',
      'Garnish: Mint sprig and grapefruit-pompadour peel.',
    ],
  },
  {
    id: '2',
    name: "Ginger Menace",
    image: require('../../assets/images/Ginger Menace Clip Art.jpeg'),
    ingredients: [
      '2 oz Rye Whiskey (Rittenhouse 100)',
      '0.5 oz Domaine de Canton Ginger Liqueur',
      '0.75 oz Fresh Lemon Juice',
      '0.5 oz Honey Syrup (1:1)',
      '2 dashes Angostura Bitters',
      'Top: Fever-Tree Ginger Beer',
      'Garnish: Candied ginger & lemon twist',
    ],
    steps: [
      'Combine whiskey, ginger liqueur, lemon juice, honey syrup, and bitters in a shaker with ice.',
      'Shake hard for 12 seconds until well-chilled.',
      'Strain into a highball glass over fresh ice.',
      'Top with ginger beer and stir gently.',
      'Garnish with candied ginger and lemon twist.',
    ],
  },
  {
    id: '3',
    name: "S'mores-sessian",
    image: require('../../assets/images/Smoresesian Clip Art.jpeg'),
    ingredients: [
      '2 oz Bourbon (Woodford Reserve)',
      '0.5 oz Chocolate Liqueur (Tempus Fugit)',
      '0.5 oz Marshmallow Syrup',
      '2 dashes Chocolate Bitters',
      'Rim: Chocolate syrup & crushed graham cracker crumbs',
      'Garnish: Mini s\'more on a cocktail pick',
    ],
    steps: [
      'Rim an Old Fashioned glass: dip in chocolate sauce, then graham cracker crumbs.',
      'Stir bourbon, chocolate liqueur, marshmallow syrup, and bitters over ice for 30 seconds.',
      'Strain over a large ice cube in the prepared glass.',
      'Torch a mini s\'more and rest on the rim.',
    ],
  },
  {
    id: '4',
    name: "Sun Damage",
    image: require('../../assets/images/Sun Damage Clip Art.jpeg'),
    ingredients: [
      '2 oz Blanco Tequila (Fortaleza)',
      '0.75 oz Aperol',
      '0.75 oz Fresh Blood Orange Juice',
      '0.5 oz Fresh Lime Juice',
      '0.5 oz Agave Syrup',
      '1 Egg White (or 1 oz Aquafaba)',
      'Top: Fever-Tree Grapefruit Soda',
      'Garnish: Dehydrated blood orange wheel & edible gold flake',
    ],
    steps: [
      'Dry shake: tequila, Aperol, blood orange juice, lime juice, agave, egg white (no ice) for 10 seconds.',
      'Wet shake: add ice, shake until tin frosts.',
      'Double strain into a chilled coupe.',
      'Top with grapefruit soda.',
      'Garnish with blood orange wheel and gold flake.',
    ],
  },
];

const CocktailIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 2h8l-1 7H9L8 2z" />
    <Path d="M6 9h12l-1.5 5.5A4 4 0 0 1 12.64 18H11.36a4 4 0 0 1-3.86-3.5L6 9z" />
    <Line x1="12" y1="18" x2="12" y2="22" />
    <Line x1="8" y1="22" x2="16" y2="22" />
  </Svg>
);

const CocktailCard: React.FC<{ cocktail: typeof mockCocktails[0]; onPress: () => void }> = ({ cocktail, onPress }) => (
  <TouchableOpacity
    style={[styles.card, Platform.OS === 'web' && styles.cardWeb]}
    onPress={onPress}
    activeOpacity={0.95}
    onFocus={() => {}}
    onBlur={() => {}}
    accessibilityRole="button"
    accessibilityLabel={`${cocktail.name} recipe`}
  >
    <View style={styles.imageWrap}>
      <Image source={cocktail.image} style={styles.image} resizeMode="contain" />
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cocktailName}>{cocktail.name}</Text>
    </View>
  </TouchableOpacity>
);

const CocktailModal: React.FC<{ cocktail: typeof mockCocktails[0] | null; onClose: () => void }> = ({ cocktail, onClose }) => {
  if (!cocktail) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.modalClose} onPress={onClose} accessibilityLabel="Close cocktail details">
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={true}>
          <View style={styles.modalInfo}>
            <Text style={styles.modalTitle}>{cocktail.name}</Text>
            <View style={styles.modalDetails}>
              {cocktail.ingredients.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  <View style={styles.listContainer}>
                    {cocktail.ingredients.map((item, i) => (
                      <Text key={i} style={styles.listItem}>• {item}</Text>
                    ))}
                  </View>
                </View>
              )}
              {cocktail.steps.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Steps</Text>
                  <View style={styles.listContainer}>
                    {cocktail.steps.map((step, i) => (
                      <Text key={i} style={[styles.listItem, styles.stepItem]}>{i + 1}. {step}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export const CocktailScreen: React.FC = () => {
  const [selectedCocktail, setSelectedCocktail] = useState<typeof mockCocktails[0] | null>(null);

  const renderItem = ({ item }: { item: typeof mockCocktails[0] }) => (
    <CocktailCard cocktail={item} onPress={() => setSelectedCocktail(item)} />
  );

return (
    <View style={styles.container}>
      <FlatList
        data={mockCocktails}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <Text style={styles.attribution}>
              Recipes created by Matt Gourley, featured on Conan O'Brien Needs a Friend.
            </Text>
            <Footer />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
grid: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 0,
    gap: spacing.xl, // 1.5rem = 24px
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.sm,
    width: cardWidth,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardWeb: {
    // Web hover/focus styles handled via activeOpacity and touch states
  },
  imageWrap: {
    width: '100%',
    height: 260,
    padding: 12, // 0.75rem
    backgroundColor: colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: undefined,
    height: undefined,
    // object-fit: contain equivalent - we use resizeMode="contain" on Image
  },
  cardInfo: {
    paddingVertical: 14, // 0.875rem
    paddingHorizontal: 16, // 1rem
    paddingBottom: 16, // 1rem
    alignItems: 'center',
  },
  cocktailName: {
    fontSize: 16, // 1rem
    fontWeight: '700',
    color: colors.gray900,
    textAlign: 'center',
    lineHeight: 22.4, // 1.4 * 16
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: spacing.md,
    zIndex: 1000,
  },
modalContent: {
    backgroundColor: colors.black,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 20, // 1.25rem
  },
  modalScroll: {
    flex: 1,
    maxHeight: '100%',
  },
  modalBody: {
    gap: 16, // 1rem
    paddingBottom: spacing.md,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: colors.primary,
  },
  modalInfo: {},
  modalTitle: {
    fontSize: 24, // 1.5rem
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8, // 0.5rem
    textAlign: 'center',
  },
  modalDetails: {
    // color and lineHeight moved to Text children
  },
  section: {
    marginBottom: 20, // matches h3 margin-bottom
  },
  sectionTitle: {
    fontSize: 16, // 1rem
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6, // 0.375rem
    marginTop: 12, // 0.75rem
  },
  listContainer: {
    marginBottom: 8, // 0.5rem
    marginLeft: 20, // 1.25rem
  },
  listItem: {
    marginBottom: 6, // 0.375rem
    fontSize: 14, // ~1rem base
    color: colors.primary,
    lineHeight: 22.4, // 1.6 * 14
  },
  stepItem: {
    // numbered steps
  },
  attribution: {
    fontSize: 10,
    color: colors.gray500,
    textAlign: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
});

export {};