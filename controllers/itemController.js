import Item from '../models/itemModel.js';

// CREATE - POST /items
export const createItem = async (req, res) => {
  try {
    const { name, hsnCode, taxType, gstRate } = req.body;

    const newItem = new Item({
      name,
      hsnCode,
      taxType,
      gstRate,
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, message: 'Item created successfully', item: savedItem });
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

// READ - GET /items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Error retrieving items:', error.message);
    res.status(500).json({ message: 'Failed to retrieve items', error: error.message });
  }
};

// UPDATE - PUT /items/:id
export const updateItem = async (req, res) => {
  const { _id } = req.params;
  try {
    const updatedItem = await Item.findByIdAndUpdate(_id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

// DELETE - DELETE /items/:id
export const deleteItem = async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedItem = await Item.findByIdAndDelete(_id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};
