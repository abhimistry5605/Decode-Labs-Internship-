export const getProductImage = (name) => {
  if (!name) return null;
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('zero to hero')) {
    return '/photos/products/combo_zero_to_hero.jpg';
  }
  if (lowercaseName.includes('smart home')) {
    return '/photos/products/combo_smart_home.jpg';
  }
  if (lowercaseName.includes('autonomous ai-robotics')) {
    return '/photos/products/combo_ai_robotics.jpg';
  }
  if (lowercaseName.includes('academic lab')) {
    return '/photos/products/combo_academic_lab.jpg';
  }
  if (lowercaseName.includes('arduino')) {
    return '/photos/products/arduino_board.jpg';
  }
  if (lowercaseName.includes('robot')) {
    return '/photos/products/robotics_kit.jpg';
  }
  if (lowercaseName.includes('iot') || lowercaseName.includes('internet of things')) {
    return '/photos/products/iot_kit.jpg';
  }
  if (lowercaseName.includes('embedded')) {
    return '/photos/products/embedded_systems.jpg';
  }
  if (lowercaseName.includes('ai') || lowercaseName.includes('artificial intelligence') || lowercaseName.includes('machine learning')) {
    return '/photos/products/ai_kit.jpg';
  }
  if (lowercaseName.includes('drone') || lowercaseName.includes('uav')) {
    return '/photos/products/drone_kit.jpg';
  }
  if (lowercaseName.includes('electronics') || lowercaseName.includes('lab') || lowercaseName.includes('circuit')) {
    return '/photos/products/electronics_equipment.jpg';
  }
  return null;
};
