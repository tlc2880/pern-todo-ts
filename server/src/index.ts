// eslint-disable-next-line no-console
import express, {Request,Response,Application} from 'express';
import cors from 'cors';
const pool = require("./db");

const app = express();

//middleware
app.use(cors());
app.use(express.json()); //req.body

app.post("/todos", async (req: Request, res: Response) => {
    try {
      const { description } = req.body;
      const newTodo = await pool.query(
        "INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description]
      );
  
      res.json(newTodo.rows[0]);
    } catch (err: any) {
      console.error(err.message);
    }
  });

//get all todos
app.get("/todos", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM todo");
      res.json(allTodos.rows);
    } catch (err: any) {
      console.error(err.message);
    }
  });

//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
        id
      ]);
  
      res.json(todo.rows[0]);
    } catch (err: any) {
      console.error(err.message);
    }
  });

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );
  
      res.json("Todo was updated!");
    } catch (err: any) {
      console.error(err.message);
    }
  });
  
//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
        id
        ]);
        res.json("Todo was deleted!");
    } catch (err: any) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log("server has started on port 5000");
  });