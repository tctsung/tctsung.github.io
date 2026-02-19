# Consecutive Numbers in SQL
[tags: tutorial, SQL, LeetCode]

A step-by-step guide to identifying consecutive numbers in SQL using ROW_NUMBER() and gaps. Includes solutions to LeetCode 603, 1285, and 1454.

---

## What to Expect

1. Step-by-step explanation of how to identify consecutive numbers. I will also provide some Python code using SQLite module, so you can try it yourself
2. Solving LeetCode 603 (Easy), 1285 (Medium), and 1454 (Medium) using this technique

## Nitty-gritty details of getting the consecutive numbers

Let's break down the process step by step. Using a simple example dataset (let's call it ids), shown in the graph below. Our goal is to identify consecutive numbers, which are highlighted in orange

![Our Goal: identify the consecutive numbers](/img/blog/20240508_consecutive-numbers-in-sql/fig1.webp)

1. We'll begin by creating a Common Table Expression (CTE). This CTE will include an extra column named orders, containing consecutive integers starting from one. Importantly, the order of this new column must align with our target column id

```sql
SELECT 
  id, 
  ROW_NUMBER() OVER(ORDER BY id) AS 'orders'
FROM ids
```

![id and orders columns](/img/blog/20240508_consecutive-numbers-in-sql/fig2.webp)

2. Next, let's subtract the orders column from the id column. The reason we are doing this is because whenever there's a discontinuity in the id, the gaps between the id and the orders will increase. Consequently, we can utilize the gaps to for grouping. If the differences remain constant, it indicates that the numbers are consecutive.

```sql
SELECT 
  id, 
  ROW_NUMBER() OVER(ORDER BY id) AS 'orders', 
  (id - ROW_NUMBER() OVER(ORDER BY id)) AS 'gaps'
FROM ids
```

![id, orders, and gaps columns](/img/blog/20240508_consecutive-numbers-in-sql/fig3.webp)

3. To get the consecutive numbers, we can simply use count() with window function, and use where to filter out the groups that have only one row

```sql
WITH t1 AS (
    SELECT 
        id, 
        -- ROW_NUMBER() OVER(ORDER BY id) AS 'orders', 
        (id - ROW_NUMBER() OVER(ORDER BY id)) AS 'gaps'
    FROM ids
), t2 AS (
    SELECT 
        id, 
        COUNT(id) OVER(PARTITION BY gaps) AS 'group_cnt'
    FROM t1
)
SELECT id
FROM t2
WHERE group_cnt > 1
```

Alternatively, you can solve this problem using GROUP BY instead of window functions. However, this approach may require an extra join or filtering. Personally, I find this solution more intuitive

```sql
WITH t1 AS (
    -- get the gaps:
    SELECT 
        id, 
        (id - ROW_NUMBER() OVER(ORDER BY id)) AS 'gaps'
    FROM ids
), t2 AS (
    -- filter to keep only the gaps that have more than one row
    SELECT gaps
    FROM t1
    group by gaps
    having count(id) > 1
)
SELECT id
FROM t1
WHERE gaps in (select gaps from t2)
```

![Final result with group_cnt](/img/blog/20240508_consecutive-numbers-in-sql/fig4.webp)

## More examples for gaps calculation

Let's clarify the concept of gaps with a few more straightforward examples.

1. Assuming all the ids in the dataset are in consecutive order. In this case, the differences between ids and orders will all be the same value

> Note: I've purposely started the IDs from 4 to show that even with a different starting point, the gaps between the columns remain consistent for grouping.

![All consecutive - gaps are constant](/img/blog/20240508_consecutive-numbers-in-sql/fig5.webp)

2. Now let's consider another scenario where none of the IDs are in consecutive order. In this case, the differences between the id and orders columns will continuously accumulate. As a result, each row became its own group.

![No consecutive - gaps keep increasing](/img/blog/20240508_consecutive-numbers-in-sql/fig6.webp)

That's basically it! From here, we can leverate the gaps information to perform a wide range of SQL queries.

## Example Code in python

Below is the code of the above example using the built-in SQLite package in Python. Feel free to experiment with it in your own machine.

Load module & generate data:

```python
import sqlite3
import pandas as pd

# Create a connection to the SQLite database
conn = sqlite3.connect('ids.db')

# Create a DataFrame with the id values
df = pd.DataFrame({'id': [1, 2, 3, 5, 7, 9, 10]})
# Write the DataFrame to a SQLite database table named "ids"
df.to_sql('ids', conn, if_exists='replace')

# helper function to do query:
def run_query(query):
    conn = sqlite3.connect('ids.db')
    output = pd.read_sql_query(query, conn)
    print(output.to_string(index=False))    # display output
```

Run query to get the gaps information:

```python
query = """
select 
    id, 
    row_number() over(order by id) as 'orders', 
    (id - row_number() over(order by id)) as 'gaps'
from ids
"""
run_query(query)
```

## LeetCode Examples: from easy to hard

Now let's solve some consecutive number problems on LeetCode!

### 603. Consecutive Available Seats (Easy)

In LeetCode problem 603, our objective is to identify consecutive free seats (represented by 'free=1'). To achieve this, we need to take one extra step:

![Goal: find consecutive FREE seats in the Cinema table](/img/blog/20240508_consecutive-numbers-in-sql/fig7.webp)

1. Filter the rows to retain only the free seats.
2. Identify the consecutive seat IDs within the remaining rows.

```sql
with t1 as (
    select 
        seat_id,
        (seat_id - row_number() over(order by seat_id)) as 'gaps'
    from Cinema
    -- filter to keep only the free seats:
    where free=1
), t2 as (
    -- count the no. of rows of each gap:
    select 
        seat_id,
        count(seat_id) over(partition by gaps) as 'group_cnt' 
    from t1
)

select seat_id
from t2
-- filter out the groups that only have 1 row:
where group_cnt > 1
order by seat_id
```

### 1285. Find the Start and End Number of Continuous Ranges

The goal of this problem is to identify the start and end numbers of each consecutive range of numbers

![Goal: identify start & end id of each consecutive numbers](/img/blog/20240508_consecutive-numbers-in-sql/fig8.webp)

1. First, we calculate the gaps to find the consecutive numbers
2. Then, we use GROUP BY gaps to identify the min and max values within each consecutive number group

```sql
with t1 as (
    select 
      log_id, 
      (log_id - (row_number() over(order by log_id)) ) as 'gaps'
    from Logs
)

select min(log_id) as 'start_id', max(log_id) as 'end_id'
from t1
group by gaps
order by 1
```

### 1454. Active Users (Medium)

The aim of this task is to identify users who have logged in consecutively for at least five days.

> Note: For simplicity, I've focused on explaining the concept of consecutive numbers here. If you're mainly interested in solving the problem, you can find my answer posted [here](https://leetcode.com/problems/active-users/solutions/5126937/beat-98-shortest-method-with-1-cte/).

![Goal: find users that log in for at least 5 consecutive days](/img/blog/20240508_consecutive-numbers-in-sql/fig9.webp)

1. To avoid repeated count for the same day, we first filter the dataset to retain only unique rows

```sql
select distinct * from Logins
```

2. To calculate the gaps as described earlier, we assign consecutive numbers to each login date WITHIN each user group.

> Note: partition by id is crucial because we're specifically interested in identifying consecutive days for each user ID. Unlike the previous example, where we are looking for consecutive numbers in the entire dataset

```sql
row_number() over(partition by id order by login_date)
```

3. To calculate the gaps between login dates, we need to convert the dates into numeric values. One approach is to convert dates into days, but this method can be memory-expensive (Eg. 2023-05-30 will be transformed to 737940)

```sql
TO_DAYS(login_date)
```

Here I use a more efficient method by calcualting the date difference between each login date and the earliest login date in the dataset

```sql
datediff(login_date, (select min(login_date) from Logins) ) + 1
```

> Note: subtracting the datedif() from row_number() can be a bit tricky sometimes. Some SQL languages (eg. MySQL) refuse to subtract an unsigned value (eg. row_number) from a signed value (eg. 0 or -1). One simple solution is to ensure all datediff() values are greater than 0. We can achieve this by simply adding 1 to the output

```sql
select 
    id,
    login_date,
    (datediff(login_date, (select min(login_date) from Logins) ) + 1) - 
    (row_number() over (partition by id order by login_date)) as 'gaps'
from (select distinct * from Logins) l
```

![Logins with calculated gaps](/img/blog/20240508_consecutive-numbers-in-sql/fig10.webp)

4. The rest is pretty straightforward! Similar to previous examples, we can use GROUP BY and then count the number of rows of each group to find the id that have at least 5 consecutive login date!

```sql
with t1 as (
    select id,
        login_date,
        (datediff(login_date, (select min(login_date) from Logins) ) + 1) - 
        (row_number() over (partition by id order by login_date)) as 'gaps'
    from (select distinct * from Logins) l
)

select distinct id
from t1
group by id, gaps
having count(id) >= 5
```

That's it! If you have any questions, don't hesitate to leave a comment below. Otherwise, happy coding!

## Reference

- [LeetCode.com](https://leetcode.com)
